import dicomParser from "dicom-parser";

// Define interfaces for type safety
export interface DICOMMetadata {
  patientName?: string;
  patientId?: string;
  studyDate?: string;
  studyTime?: string;
  modality?: string;
  studyInstanceUid?: string;
  accessionNumber?: string;
}

export interface ImagePixelData {
  columns?: number;
  rows?: number;
  pixelData?: Uint16Array;
}

// This is the main interface that should be used in the store
export interface DICOMImage {
  imageId: string; // Added for cornerstone compatibility
  metadata: DICOMMetadata;
  pixelData: ImagePixelData;
  windowWidth?: number;
  windowCenter?: number;
}

// Keep backward compatibility
export type DICOMData = DICOMImage;

export const parseDICOMFile = (file: File): Promise<DICOMImage> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("No data read from file");
        }
        const arrayBuffer = event.target.result as ArrayBuffer;
        // Convert ArrayBuffer to Uint8Array for dicom-parser
        const uint8Array = new Uint8Array(arrayBuffer);
        const dataSet = dicomParser.parseDicom(uint8Array);

        if (!dataSet) {
          throw new Error("Failed to parse DICOM data");
        }

        const metadata = extractDICOMTags(dataSet);
        const pixelData = extractPixelData(dataSet);

        // Extract window/level information
        const windowWidth = dataSet.floatString("x00281051") || 2000;
        const windowCenter = dataSet.floatString("x00281050") || 1000;

        // Generate imageId for cornerstone
        const imageId = `wadouri:${URL.createObjectURL(file)}`;

        resolve({
          imageId,
          metadata,
          pixelData,
          windowWidth,
          windowCenter,
        });
      } catch (error) {
        reject(
          new Error(
            `DICOM parsing failed: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          )
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read DICOM file"));
    };

    reader.readAsArrayBuffer(file);
  });
};

const extractDICOMTags = (dataSet: dicomParser.DataSet): DICOMMetadata => ({
  patientName: dataSet.string("x00100010") || undefined,
  patientId: dataSet.string("x00100020") || undefined,
  studyDate: dataSet.string("x00080020") || undefined,
  studyTime: dataSet.string("x00080030") || undefined,
  modality: dataSet.string("x00080060") || undefined,
  studyInstanceUid: dataSet.string("x0020000d") || undefined,
  accessionNumber: dataSet.string("x00080050") || undefined,
});

const extractPixelData = (dataSet: dicomParser.DataSet): ImagePixelData => {
  const transferSyntax = dataSet.string("x00020010") || "";
  const pixelDataElement = dataSet.elements.x7fe00010;

  if (!pixelDataElement) {
    return { columns: undefined, rows: undefined, pixelData: undefined };
  }

  // Handle different transfer syntaxes
  if (transferSyntax.includes("1.2.840.10008.1.2")) {
    // Uncompressed
    const columns = dataSet.uint16("x00280011");
    const rows = dataSet.uint16("x00280010");

    // Better error handling for pixel data extraction
    try {
      const pixelData = new Uint16Array(
        dataSet.byteArray.buffer,
        pixelDataElement.dataOffset,
        pixelDataElement.length / 2
      );

      return {
        columns: columns || undefined,
        rows: rows || undefined,
        pixelData,
      };
    } catch (error) {
      console.error("Failed to extract pixel data:", error);
      return { columns, rows, pixelData: undefined };
    }
  } else {
    console.warn("Unsupported transfer syntax:", transferSyntax);
    return {
      columns: dataSet.uint16("x00280011") || undefined,
      rows: dataSet.uint16("x00280010") || undefined,
      pixelData: undefined,
    };
  }
};
