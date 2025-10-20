import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploaderProps {
  onFilesAccepted: (files: File[]) => void;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxFiles?: number;
  className?: string;
  children?: React.ReactNode;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesAccepted,
  accept = { "text/plain": [".txt"], "application/pdf": [".pdf"] },
  multiple = true,
  maxFiles = 10,
  className = "",
  children,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAccepted(acceptedFiles);
    },
    [onFilesAccepted]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxFiles,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 backdrop-blur-sm
        ${
          isDragActive
            ? "border-purple-500 bg-glass-purple shadow-lg"
            : "border-white/30 hover:border-purple-400 hover:bg-glass-white/50 hover:shadow-lg"
        }
        ${className}
      `}
    >
      <input {...getInputProps()} />
      {children || (
        <div className="animate-fade-in">
          <div className="text-4xl mb-4">📁</div>
          <p className="text-lg font-medium text-white mb-2">
            {isDragActive ? "Drop files here" : "Drag & drop files here"}
          </p>
          <p className="text-gray-300">or click to select files</p>
          <p className="text-sm text-gray-400 mt-2">
            Supports: {Object.keys(accept).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
