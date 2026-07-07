import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';

import { getFirebaseStorage } from '@/firebase/storage';
import { STORAGE_PATHS } from '@/utils/constants';
import { AppError } from '@/utils/AppError';

export type ImageUploadKind = 'profile' | 'restaurantLogo' | 'restaurantCover' | 'food' | 'review';

export type UploadImageInput = {
  uri: string;
  ownerId: string;
  kind: ImageUploadKind;
  fileName?: string;
  contentType?: string;
  onProgress?: (progress: number) => void;
};

function getStorageFolder(kind: ImageUploadKind) {
  const folderMap: Record<ImageUploadKind, string> = {
    profile: STORAGE_PATHS.profileImages,
    restaurantLogo: STORAGE_PATHS.restaurantImages,
    restaurantCover: STORAGE_PATHS.restaurantImages,
    food: STORAGE_PATHS.foodImages,
    review: STORAGE_PATHS.reviewImages,
  };

  return folderMap[kind];
}

function createFileName(input: UploadImageInput) {
  const prefix = input.kind.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
  return input.fileName ?? `${prefix}-${Date.now()}.jpg`;
}

export async function uploadImageAsync(input: UploadImageInput) {
  const storage = getFirebaseStorage();

  if (!storage) {
    throw new AppError('firebase/configuration', 'Firebase Storage is not configured. Add Expo Firebase environment values first.');
  }

  const response = await fetch(input.uri);
  const blob = await response.blob();
  const folder = getStorageFolder(input.kind);
  const storageReference = ref(storage, `${folder}/${input.ownerId}/${createFileName(input)}`);
  const uploadTask = uploadBytesResumable(storageReference, blob, { contentType: input.contentType ?? 'image/jpeg' });

  return new Promise<string>((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.totalBytes > 0 ? snapshot.bytesTransferred / snapshot.totalBytes : 0;
        input.onProgress?.(Math.round(progress * 100));
      },
      reject,
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
        input.onProgress?.(100);
        resolve(downloadUrl);
      },
    );
  });
}
