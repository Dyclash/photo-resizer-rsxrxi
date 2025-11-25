
import JSZip from 'jszip';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';
import { ResizedPhoto } from '../types/PhotoTypes';

export async function exportPhotosAsZip(photos: ResizedPhoto[]): Promise<void> {
  try {
    console.log('Starting ZIP export for', photos.length, 'photos');
    
    const zip = new JSZip();
    const folder = zip.folder('resized-photos');

    if (!folder) {
      throw new Error('Failed to create ZIP folder');
    }

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      console.log(`Processing photo ${i + 1}/${photos.length}: ${photo.specification}`);
      
      try {
        const base64Data = await FileSystem.readAsStringAsync(photo.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const fileName = `photo-${i + 1}-${photo.specification.replace(/[^a-z0-9]/gi, '-')}-${photo.width}x${photo.height}.jpg`;
        folder.file(fileName, base64Data, { base64: true });
      } catch (error) {
        console.error(`Error processing photo ${i + 1}:`, error);
      }
    }

    console.log('Generating ZIP file...');
    const zipContent = await zip.generateAsync({ 
      type: 'base64',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    const zipFileName = `app-store-photos-${Date.now()}.zip`;
    const zipFilePath = FileSystem.documentDirectory + zipFileName;

    console.log('Writing ZIP file to:', zipFilePath);
    await FileSystem.writeAsStringAsync(zipFilePath, zipContent, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (Platform.OS === 'web') {
      const link = document.createElement('a');
      link.href = `data:application/zip;base64,${zipContent}`;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      Alert.alert('Success', 'ZIP file downloaded successfully!');
    } else {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        await Sharing.shareAsync(zipFilePath, {
          mimeType: 'application/zip',
          dialogTitle: 'Save ZIP file',
          UTI: 'public.zip-archive',
        });
      } else {
        Alert.alert('Success', 'ZIP file created at: ' + zipFilePath);
      }
    }

    console.log('ZIP export completed successfully');
  } catch (error) {
    console.error('Error creating ZIP file:', error);
    throw error;
  }
}
