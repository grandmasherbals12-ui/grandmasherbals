import React, { useState } from "react";
import { useImageUpload } from "@/hooks/use-image-upload";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, X } from "lucide-react";

interface ImageUploadProps {
  bucket: string;
  path: string;
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket,
  path,
  onUploadSuccess,
  onUploadError,
  disabled = false,
  className = "",
  label = "Upload Image",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const { uploadImage, uploading, error } = useImageUpload();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const result = await uploadImage(file, bucket, path);
    if (result) {
      onUploadSuccess(result.url);
    } else if (onUploadError) {
      onUploadError(error || "Upload failed");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className={className}>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative rounded-lg border-2 border-dashed p-8 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 bg-gray-50"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          disabled={disabled || uploading}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          {uploading ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">{label}</p>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, GIF up to 5MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 rounded-md bg-red-50 p-3 text-sm text-red-800 flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={() => setDragActive(false)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
