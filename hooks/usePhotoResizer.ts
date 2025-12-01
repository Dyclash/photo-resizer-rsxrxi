
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { UploadedPhoto, ResizedPhoto, AppStoreSpec, APP_STORE_SPECS } from '../types/PhotoTypes';
import { resizeImageToSelectedSpecs } from '../utils/imageResizer';

export function usePhotoResizer() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [resizedPhotos, setResizedPhotos] = useState<ResizedPhoto[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<AppStoreSpec[]>([...APP_STORE_SPECS]);

  const pickImages = async () => {
    try {
      // Request permissions first
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant permission to access your photo library.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        quality: 1,
        selectionLimit: 12,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newPhotos: UploadedPhoto[] = result.assets.map((asset, index) => {
          if (!asset.uri) {
            console.error('Asset missing URI:', asset);
            return null;
          }

          return {
            id: `${Date.now()}-${index}`,
            uri: asset.uri,
            width: asset.width || 0,
            height: asset.height || 0,
            fileName: asset.fileName || `image-${index}.jpg`,
          };
        }).filter((photo): photo is UploadedPhoto => photo !== null);

        if (newPhotos.length === 0) {
          Alert.alert('Error', 'No valid images were selected.');
          return;
        }

        setPhotos(prev => {
          const combined = [...prev, ...newPhotos];
          const limited = combined.slice(0, 12);
          
          if (combined.length > 12) {
            Alert.alert('Limit Reached', 'Maximum 12 photos allowed. Only the first 12 will be kept.');
          }
          
          return limited;
        });
      }
    } catch (error) {
      console.error('Error picking images:', error);
      throw error;
    }
  };

  const removePhoto = (id: string) => {
    if (!id) {
      console.error('Invalid photo ID');
      return;
    }

    setPhotos(prev => prev.filter(photo => photo.id !== id));
    setResizedPhotos(prev => prev.filter(photo => photo.originalId !== id));
  };

  const resizeAllPhotos = async () => {
    if (!photos || photos.length === 0) {
      console.log('No photos to resize');
      throw new Error('No photos to resize');
    }

    if (!selectedSpecs || selectedSpecs.length === 0) {
      console.log('No specifications selected');
      throw new Error('Please select at least one specification');
    }

    setIsResizing(true);
    const allResized: ResizedPhoto[] = [];
    let successCount = 0;
    let failCount = 0;

    try {
      for (const photo of photos) {
        if (!photo || !photo.uri) {
          console.error('Invalid photo:', photo);
          failCount++;
          continue;
        }

        try {
          const resized = await resizeImageToSelectedSpecs(photo.uri, selectedSpecs);
          
          if (resized && resized.length > 0) {
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
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          console.error(`Error resizing photo ${photo.id}:`, error);
          failCount++;
        }
      }

      if (allResized.length === 0) {
        throw new Error('Failed to resize any photos');
      }

      setResizedPhotos(allResized);

      if (failCount > 0) {
        Alert.alert(
          'Partial Success',
          `Successfully resized ${successCount} photo(s). ${failCount} photo(s) failed.`
        );
      }
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
    selectedSpecs,
    setSelectedSpecs,
    pickImages,
    removePhoto,
    resizeAllPhotos,
    clearAll,
  };
}
