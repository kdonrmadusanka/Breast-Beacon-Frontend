import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FiUpload, FiBookOpen, FiVideo, FiAlertCircle } from "react-icons/fi";
import { Typography, Box } from "@mui/material";
import Button from "./Button";
import Input from "./Input";

interface AnalysisResult {
  prediction: string;
  confidence: number;
  imageUrl: string;
  segmentationMaskUrl: string;
}

const PatientPortal: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Basic file validation
      if (selectedFile.size > 10 * 1024 * 1024) {
        // 10MB limit
        setError("File size exceeds 10MB limit");
        setFile(null);
      } else if (
        !["image/png", "application/dicom"].includes(selectedFile.type)
      ) {
        setError("Only PNG or DICOM files are allowed");
        setFile(null);
      } else {
        setError(undefined);
        setFile(selectedFile);
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        setFile(null);
      } else if (
        !["image/png", "application/dicom"].includes(droppedFile.type)
      ) {
        setError("Only PNG or DICOM files are allowed");
        setFile(null);
      } else {
        setError(undefined);
        setFile(droppedFile);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("patientId", localStorage.getItem("userId") || "anonymous");
    try {
      const res = await axios.post("/api/mammogram/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.analysis);
      setError(undefined);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box className="container mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h4"
          className="text-primary font-bold mb-6 flex items-center"
        >
          <FiAlertCircle className="mr-2" /> Patient Portal
        </Typography>
      </motion.div>

      <motion.div
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center ${
          dragOver ? "border-primary bg-blue-50" : "border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        initial={{ scale: 0.95 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Input
          label="Mammogram File"
          type="file"
          icon={FiUpload}
          value={file}
          onChange={handleFileChange}
          accept=".png,.dcm"
          size="medium"
          color="primary"
          error={error}
          ref={fileInputRef}
        />
        <Typography className="text-gray-600 mt-2">
          {file
            ? file.name
            : "Drag & drop your mammogram here or click to select"}
        </Typography>
        <Button
          text="Select File"
          icon={FiUpload}
          variant="outlined"
          color="primary"
          size="medium"
          onClick={() => fileInputRef.current?.click()}
        />
      </motion.div>

      <Button
        text={uploading ? "Uploading..." : "Upload Mammogram"}
        icon={FiUpload}
        variant="filled"
        color="primary"
        size="medium"
        onClick={handleUpload}
        disabled={!file || uploading}
      />

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 p-6 bg-white rounded-lg shadow-lg"
          >
            <Typography className="text-gray-800 font-semibold">
              Prediction: {result.prediction} (Confidence:{" "}
              {result.confidence.toFixed(2)})
            </Typography>
            <Box className="mt-4">
              <Typography className="text-gray-600">
                Image and mask visualization will be displayed here.
              </Typography>
            </Box>
            <div className="mt-4 flex gap-2">
              <Button
                text="View Progression"
                icon={FiBookOpen}
                variant="filled"
                color="secondary"
                size="medium"
                onClick={() => navigate("/progression")}
              />
              <Button
                text="Book Telemedicine"
                icon={FiVideo}
                variant="filled"
                color="accent"
                size="medium"
                onClick={() => navigate("/telemedicine")}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        text="Educational Resources"
        icon={FiBookOpen}
        variant="outlined"
        color="primary"
        size="medium"
        onClick={() => navigate("/education")}
        className="mt-6"
      />
    </Box>
  );
};

export default PatientPortal;
