
import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { toast } from '@/hooks/use-toast';

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
}

interface CompressImageResult {
  compressedFile: File | null;
  compressedUrl: string | null;
  originalSize: string;
  compressedSize: string;
  compressionRatio: string;
}

export function useImageCompression() {
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const compressImage = async (
    imageFile: File,
    options: CompressionOptions = {}
  ): Promise<CompressImageResult | null> => {
    if (!imageFile) {
      toast({
        title: "Error",
        description: "No image file provided",
        variant: "destructive",
      });
      return null;
    }

    try {
      setIsCompressing(true);
      setProgress(0);

      const compressionOptions = {
        maxSizeMB: options.maxSizeMB || 1, // Default to 1MB max size
        maxWidthOrHeight: options.maxWidthOrHeight || 1920, // Default to 1920px width/height
        useWebWorker: options.useWebWorker !== false, // Default to true
        onProgress: (p: number) => setProgress(Math.round(p * 100)),
      };

      const originalSizeInMB = imageFile.size / (1024 * 1024);
      
      const compressedFile = await imageCompression(imageFile, compressionOptions);
      const compressedSizeInMB = compressedFile.size / (1024 * 1024);
      const compressionRatio = ((1 - compressedSizeInMB / originalSizeInMB) * 100).toFixed(1);
      
      const compressedUrl = URL.createObjectURL(compressedFile);
      
      const result = {
        compressedFile,
        compressedUrl,
        originalSize: `${originalSizeInMB.toFixed(2)} MB`,
        compressedSize: `${compressedSizeInMB.toFixed(2)} MB`,
        compressionRatio: `${compressionRatio}%`
      };

      // Show success notification if compression was significant
      if (parseFloat(compressionRatio) > 20) {
        toast({
          title: "Image Compressed Successfully",
          description: `Reduced by ${compressionRatio}% (${result.originalSize} → ${result.compressedSize})`,
        });
      }
      
      return result;
    } catch (error) {
      console.error("Image compression failed:", error);
      toast({
        title: "Compression Failed",
        description: "There was a problem compressing your image",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsCompressing(false);
      setProgress(0);
    }
  };

  return { compressImage, isCompressing, progress };
}
