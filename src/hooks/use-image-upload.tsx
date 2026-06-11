import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface UploadProgress {
  loaded: number;
  total: number;
  progress: number;
}

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgress | null>(null);

  const uploadImage = async (
    file: File,
    bucket: string,
    path: string
  ): Promise<{ url: string; filename: string } | null> => {
    try {
      setUploading(true);
      setError(null);

      // Validate file
      const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        throw new Error("File size must be less than 5MB");
      }

      // Generate unique filename
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
      const fullPath = `${path}/${filename}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fullPath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(fullPath);

      setProgress(null);
      setUploading(false);

      return { url: publicUrl, filename };
    } catch (err: any) {
      const errorMessage =
        err.message || "An error occurred during upload";
      setError(errorMessage);
      setUploading(false);
      return null;
    }
  };

  const uploadProductImage = async (
    file: File,
    productId: string
  ): Promise<string | null> => {
    const result = await uploadImage(file, "product-images", productId);
    return result?.url || null;
  };

  const uploadProfileImage = async (
    file: File,
    userId: string
  ): Promise<string | null> => {
    const result = await uploadImage(file, "profile-images", userId);
    return result?.url || null;
  };

  const deleteImage = async (
    bucket: string,
    path: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.storage.from(bucket).remove([path]);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error("Error deleting image:", err);
      return false;
    }
  };

  return {
    uploadImage,
    uploadProductImage,
    uploadProfileImage,
    deleteImage,
    uploading,
    error,
    progress,
  };
};
