import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUpload, FiX, FiCheck, FiImage, FiFile } from "react-icons/fi";
import { Button, ProgressBar } from "../../components/ui/Index";
import { cn } from "../../utils/cn";
import { FileUpload } from "../../components/dicom/FileUpload";
import WindowLevelControls from "../../components/dicom/WindowLevelControls";
import { MammogramVisualizer } from "../../mammogram/MammogramVisualizer";
import { useDICOMStore } from "../../store/dicomStore";
import { parseDICOMFile, type DICOMImage } from "../../lib/dicom/dicomParser";
import { dicomService, analysisService } from "../../services/api";
import { useWebSocket } from "../../services/websocket";

interface UploadProgress {
  [key: string]: {
    progress: number;
    status: "uploading" | "processing" | "completed" | "failed";
    message?: string;
  };
}

const UploadMammogram = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [dicomImages, setDicomImages] = useState<DICOMImage[]>([]);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const { isLoading, error, actions } = useDICOMStore();

  // WebSocket handler for real-time updates
  const handleWebSocketMessage = useCallback(
    (message: {
      event: string;
      data: {
        studyId: string;
        progress?: number;
        status?: string;
        message?: string;
      };
    }) => {
      if (
        message.event === "UPLOAD_PROGRESS" ||
        message.event === "ANALYSIS_PROGRESS" ||
        message.event === "ANALYSIS_UPDATE"
      ) {
        setUploadProgress((prev) => ({
          ...prev,
          [message.data.studyId]: {
            progress:
              message.data.progress ||
              prev[message.data.studyId]?.progress ||
              0,
            status:
              (message.data.status as
                | "uploading"
                | "processing"
                | "completed"
                | "failed") ||
              prev[message.data.studyId]?.status ||
              "uploading",
            message: message.data.message,
          },
        }));
      }
    },
    []
  );

  const { connect, disconnect, joinRoom } = useWebSocket(
    handleWebSocketMessage
  );

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles) return;

      const newFiles = Array.from(selectedFiles).slice(0, 5 - files.length);
      setFiles((prev) => [...prev, ...newFiles]);

      try {
        const processingResults = await Promise.all(
          newFiles.map(async (file) => {
            try {
              const dicomImage = await parseDICOMFile(file);
              return { file, dicomImage };
            } catch (err) {
              console.error(`Failed to parse ${file.name}:`, err);
              return {
                file,
                error:
                  err instanceof Error ? err.message : "Failed to parse DICOM",
              };
            }
          })
        );

        const successful = processingResults.filter((r) => !("error" in r)) as {
          file: File;
          dicomImage: DICOMImage;
        }[];

        setDicomImages((prev) => [
          ...prev,
          ...successful.map((r) => r.dicomImage),
        ]);

        if (successful.length > 0 && !selectedImageId) {
          setSelectedImageId(successful[0].dicomImage.imageId);
        }

        // Show errors for failed files
        processingResults.forEach((result) => {
          if ("error" in result) {
            actions.setError(
              `Failed to process ${result.file.name}: ${result.error}`
            );
          }
        });
      } catch (error) {
        actions.setError(
          error instanceof Error ? error.message : "Failed to process files"
        );
      }
    },
    [files.length, selectedImageId, actions]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = [...files];
      const newImages = [...dicomImages];
      const removedFile = newFiles.splice(index, 1)[0];
      const removedImage = newImages.splice(index, 1)[0];

      setFiles(newFiles);
      setDicomImages(newImages);

      // Update progress tracking
      setUploadProgress((prev) => {
        const newProgress = { ...prev };
        if (removedImage?.imageId) {
          delete newProgress[removedImage.imageId];
        }
        return newProgress;
      });

      // Reset selection if needed
      if (removedImage?.imageId === selectedImageId) {
        setSelectedImageId(newImages[0]?.imageId || null);
        if (newImages[0]) {
          actions.loadDICOM(newFiles[0]);
        }
      }
    },
    [files, dicomImages, selectedImageId, actions]
  );

  const handleUpload = useCallback(async () => {
    setIsUploading(true);
    actions.clearError();

    try {
      const uploadResults = await Promise.all(
        files.map(async (file, index) => {
          if (!dicomImages[index]) return null;

          try {
            // Upload DICOM file
            const response = await dicomService.uploadDICOM(file);

            // Join WebSocket room for real-time updates
            if (joinRoom) {
              joinRoom(response.id);
            }

            // Initialize progress tracking
            setUploadProgress((prev) => ({
              ...prev,
              [response.id]: {
                progress: 0,
                status: "uploading",
                message: "Uploading to server...",
              },
            }));

            // Queue analysis after upload
            await analysisService.queueAnalysis(response.id);

            return {
              fileIndex: index,
              studyId: response.id,
              previewURL: response.filePath || response.previewURL,
            };
          } catch (err) {
            console.error(`Upload failed for ${file.name}:`, err);
            return {
              fileIndex: index,
              error: err instanceof Error ? err.message : "Upload failed",
            };
          }
        })
      );

      // Update image IDs with the ones from the server
      setDicomImages((prev) => {
        const updated = [...prev];
        uploadResults.forEach((result) => {
          if (result && !("error" in result)) {
            updated[result.fileIndex] = {
              ...updated[result.fileIndex],
              imageId: result.previewURL,
            };
          }
        });
        return updated;
      });

      // Show any upload errors
      uploadResults.forEach((result) => {
        if (result && "error" in result) {
          actions.setError(
            `Failed to upload ${files[result.fileIndex].name}: ${result.error}`
          );
        }
      });
    } catch (error) {
      actions.setError(
        error instanceof Error ? error.message : "Failed to start upload"
      );
    } finally {
      setIsUploading(false);
    }
  }, [files, dicomImages, actions, joinRoom]);

  const completedCount = Object.values(uploadProgress).filter(
    (p) => p.status === "completed"
  ).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Upload Mammogram</h1>
        <p className="text-muted-foreground">
          Upload your DICOM mammogram images for analysis
        </p>
      </div>

      <FileUpload onFileChange={handleFileChange} />

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 border rounded-lg bg-red-50 border-red-100 flex items-center space-x-3"
        >
          <FiX className="w-5 h-5 text-red-600" />
          <div>
            <p className="font-medium text-red-600">Error</p>
            <p className="text-sm text-red-500">{error}</p>
            <button
              onClick={actions.clearError}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear Error
            </button>
          </div>
        </motion.div>
      )}

      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-medium">Selected Files</h2>
          <ul className="space-y-2">
            {files.map((file, index) => {
              const image = dicomImages[index];
              const progress = image?.imageId
                ? uploadProgress[image.imageId]
                : undefined;

              return (
                <motion.li
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    {file.type.startsWith("image/") ? (
                      <FiImage className="w-5 h-5 text-blue-500" />
                    ) : (
                      <FiFile className="w-5 h-5 text-purple-500" />
                    )}
                    <span
                      className={cn(
                        "truncate max-w-xs",
                        image?.imageId
                          ? "cursor-pointer hover:underline"
                          : "text-gray-500"
                      )}
                      onClick={() => {
                        if (image?.imageId) {
                          setSelectedImageId(image.imageId);
                          actions.loadDICOM(file);
                        }
                      }}
                    >
                      {file.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {progress && (
                      <div className="flex items-center space-x-2">
                        <ProgressBar
                          progress={progress.progress}
                          size="sm"
                          color={
                            progress.status === "failed"
                              ? "danger"
                              : progress.status === "completed"
                              ? "success"
                              : "primary"
                          }
                          showPercentage={true}
                          className="w-24"
                        />
                        {progress.message && (
                          <span className="text-xs text-muted-foreground">
                            {progress.message}
                          </span>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 rounded-full hover:bg-red-100 text-red-500"
                      disabled={isUploading}
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                </motion.li>
              );
            })}
          </ul>

          <Button
            text={`Upload ${files.length} file${files.length !== 1 ? "s" : ""}`}
            icon={FiUpload}
            variant="filled"
            color="primary"
            size="large"
            className="w-full"
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
            loading={isUploading}
          />
        </div>
      )}

      {completedCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 border rounded-lg bg-green-50 border-green-100 flex items-center space-x-3"
        >
          <FiCheck className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-medium">Upload complete!</p>
            <p className="text-sm text-muted-foreground">
              {completedCount === 1
                ? "1 mammogram has been uploaded and is being analyzed."
                : `${completedCount} mammograms have been uploaded and are being analyzed.`}
            </p>
          </div>
        </motion.div>
      )}

      {dicomImages.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">Image Adjustments</h2>
          <WindowLevelControls />
        </div>
      )}

      {selectedImageId && (
        <div className="mt-8">
          <h2 className="text-xl font-medium mb-4">Mammogram Visualization</h2>
          <MammogramVisualizer imageUrl={selectedImageId} />
        </div>
      )}
    </motion.div>
  );
};

export default UploadMammogram;
