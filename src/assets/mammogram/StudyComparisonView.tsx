import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MammogramVisualizer } from "./MammogramVisualizer";
import { useDICOMStore } from "../store/dicomStore";
import { Button } from "../components/ui/Index";
import { FiLink, FiLink2 } from "react-icons/fi";
import type { DICOMImage } from "../lib/dicom/dicomParser";

interface StudyComparisonViewProps {
  image1: DICOMImage;
  image2: DICOMImage;
}

const StudyComparisonView: React.FC<StudyComparisonViewProps> = ({
  image1,
  image2,
}) => {
  const { viewportSettings, actions } = useDICOMStore();
  const [isSynced, setIsSynced] = useState<boolean>(true);

  const handleSyncToggle = useCallback(() => {
    setIsSynced((prev) => !prev);
  }, []);

  // Apply viewport settings to the second image if synced
  const secondViewportSettings = isSynced
    ? viewportSettings
    : {
        windowWidth: image2.windowWidth || 2000,
        windowCenter: image2.windowCenter || 1000,
        invert: false,
        scale: 1,
        brightness: 0,
        contrast: 0,
      };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Study Comparison</h2>
        <Button
          text={isSynced ? "Unsync Viewports" : "Sync Viewports"}
          icon={isSynced ? FiLink2 : FiLink}
          variant="outlined"
          size="small"
          onClick={handleSyncToggle}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Study 1: {image1.metadata.patientName || "Unknown Patient"} (
            {image1.metadata.studyDate || "N/A"})
          </h3>
          <MammogramVisualizer imageUrl={image1.imageId} />
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Study 2: {image2.metadata.patientName || "Unknown Patient"} (
            {image2.metadata.studyDate || "N/A"})
          </h3>
          <MammogramVisualizer imageUrl={image2.imageId} />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-2">Metadata Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="text-left p-2">Field</th>
              <th className="text-left p-2">Study 1</th>
              <th className="text-left p-2">Study 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-2">Patient Name</td>
              <td className="p-2">{image1.metadata.patientName || "N/A"}</td>
              <td className="p-2">{image2.metadata.patientName || "N/A"}</td>
            </tr>
            <tr>
              <td className="p-2">Patient ID</td>
              <td className="p-2">{image1.metadata.patientId || "N/A"}</td>
              <td className="p-2">{image2.metadata.patientId || "N/A"}</td>
            </tr>
            <tr>
              <td className="p-2">Study Date</td>
              <td className="p-2">{image1.metadata.studyDate || "N/A"}</td>
              <td className="p-2">{image2.metadata.studyDate || "N/A"}</td>
            </tr>
            <tr>
              <td className="p-2">Modality</td>
              <td className="p-2">{image1.metadata.modality || "N/A"}</td>
              <td className="p-2">{image2.metadata.modality || "N/A"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StudyComparisonView;
