import React, { useState } from "react";
import { UploadIcon, CheckCircle, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { dicomService } from "../../services/api";

interface FileUploadProps {
  onFileChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadSuccess?: (response: any) => void;
  onUploadError?: (error: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileChange,
  onUploadSuccess,
  onUploadError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [progress, setProgress] = useState<number>(0);
  const { token, isAuthenticated } = useAuthStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (
      !file.name.match(/\.(dcm|dic|dicom|jpg|jpeg|png)$/i) &&
      !["image/jpeg", "image/png"].includes(file.type)
    ) {
      setUploadStatus("error");
      setErrorMessage(
        "Invalid file type. Please upload .dcm, .dic, .dicom, .jpg, .jpeg, or .png files."
      );
      onUploadError?.(errorMessage);
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setUploadStatus("error");
      setErrorMessage("File size exceeds 10MB limit");
      onUploadError?.(errorMessage);
      return;
    }

    // Call parent onFileChange if provided
    onFileChange?.(e);

    // Upload the file
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");
    setProgress(0);

    try {
      if (!isAuthenticated || !token) {
        setErrorMessage("Authentication required. Please log in.");
        window.location.href = "/login";
        return;
      }

      console.log("Uploading file with token:", token.substring(0, 20) + "...");
      const response = await dicomService.uploadDICOM(
        file,
        (progressPercent) => {
          setProgress(progressPercent);
        }
      );

      if (response.success) {
        setUploadStatus("success");
        setErrorMessage("");
        onUploadSuccess?.(response.data);
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error: any) {
      console.error("Upload error:", error, error.response?.data);
      setUploadStatus("error");
      const errorMsg = error.message || "Upload failed";
      setErrorMessage(errorMsg);
      onUploadError?.(errorMsg);
      if (errorMsg.includes("401") || errorMsg.includes("Unauthorized")) {
        console.log("401 detected, logging out");
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        accept=".dcm,.dic,.dicom,image/jpeg,image/png"
        onChange={handleFileSelect}
        className="hidden"
        id="dicom-upload"
        disabled={isUploading}
      />
      <label
        htmlFor="dicom-upload"
        className={`cursor-pointer block ${isUploading ? "opacity-50" : ""}`}
      >
        <div className="flex flex-col items-center justify-center">
          {uploadStatus === "success" ? (
            <CheckCircle className="h-12 w-12 text-green-500" />
          ) : uploadStatus === "error" ? (
            <AlertCircle className="h-12 w-12 text-red-500" />
          ) : (
            <UploadIcon className="h-12 w-12 text-gray-400" />
          )}

          <p className="mt-2 text-sm text-gray-600">
            {isUploading
              ? `Uploading... (${progress}%)`
              : uploadStatus === "success"
              ? "Upload successful!"
              : uploadStatus === "error"
              ? errorMessage || "Upload failed"
              : "Drag & drop DICOM or image files or click to browse"}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Supports: .dcm, .dic, .dicom, .jpg, .jpeg, .png (Max: 10MB)
          </p>
        </div>
      </label>
    </div>
  );
};
