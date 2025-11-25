
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { UploadedPhoto, ResizedPhoto } from '../types/PhotoTypes';
import { resizeImageToAllSpecs } from '../utils/imageResizer';

export function usePhotoResizer() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [resizedPhotos, setResizedPhotos] = useState<ResizedPhoto[]>([]);
  const [isResizing, setIsResizing] = useState(false);

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 12,
      });

      if (!result.canceled && result.assets) {
        const newPhotos: UploadedPhoto[] = result.assets.map((asset, index) => ({
          id: `${Date.now()}-${index}`,
          uri: asset.uri,
          width: asset.width,
          height: asset.height,
          fileName: asset.fileName || `image-${index}.jpg`,
        }));

        setPhotos(prev => {
          const combined = [...prev, ...newPhotos];
          return combined.slice(0, 12);
        });
      }
    } catch (error) {
      console.error('Error picking images:', error);
      throw error;
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
    setResizedPhotos(prev => prev.filter(photo => photo.originalId !== id));
  };

  const resizeAllPhotos = async () => {
    if (photos.length === 0) {
      console.log('No photos to resize');
      return;
    }

    setIsResizing(true);
    const allResized: ResizedPhoto[] = [];

    try {
      for (const photo of photos) {
        const resized = await resizeImageToAllSpecs(photo.uri);
        resized.forEach((img, index) => {
          allResized.push({
            id: `${photo.id}-${index}`,
            originalId: photo.id,
            uri: img.uri,
            width: img.width,
            height: img.height,
            specification: img.specification,
          });
        });
      }

      setResizedPhotos(allResized);
    } catch (error) {
      console.error('Error resizing photos:', error);
      throw error;
    } finally {
      setIsResizing(false);
    }
  };

  const clearAll = () => {
    setPhotos([]);
    setResizedPhotos([]);
  };

  return {
    photos,
    resizedPhotos,
    isResizing,
    pickImages,
    removePhoto,
    resizeAllPhotos,
    clearAll,
  };
}
