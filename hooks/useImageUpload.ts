import { useCallback, useState } from 'react';

import { uploadImageAsync, UploadImageInput } from '@/services/storageService';

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(async (input: Omit<UploadImageInput, 'onProgress'>) => {
    setUploading(true);
    setProgress(0);
    setError(null);
    setDownloadUrl(null);

    try {
      const nextUrl = await uploadImageAsync({ ...input, onProgress: setProgress });
      setDownloadUrl(nextUrl);
      return nextUrl;
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : 'Image upload failed. Please try again.';
      setError(message);
      throw nextError;
    } finally {
      setUploading(false);
    }
  }, []);

  return { progress, uploading, downloadUrl, error, uploadImage };
}
