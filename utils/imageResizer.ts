
import * as ImageManipulator from 'expo-image-manipulator';
import { APP_STORE_SPECS, AppStoreSpec } from '../types/PhotoTypes';

export async function resizeImageToSpec(
  imageUri: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  if (!imageUri) {
    throw new Error('Image URI is required');
  }

  if (!targetWidth || !targetHeight || targetWidth <= 0 || targetHeight <= 0) {
    throw new Error('Invalid target dimensions');
  }

  try {
    console.log(`Resizing image to ${targetWidth}x${targetHeight}`);
    
    // App Store screenshots should be PNG format for best quality
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: targetWidth, height: targetHeight } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    if (!result || !result.uri) {
      throw new Error('Failed to resize image - no result URI');
    }

    console.log(`Successfully resized image to ${targetWidth}x${targetHeight}`);
    return result.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
}

export async function resizeImageToAllSpecs(imageUri: string) {
  if (!imageUri) {
    throw new Error('Image URI is required');
  }

  const resizedImages = [];
  
  for (const spec of APP_STORE_SPECS) {
    try {
      const resizedUri = await resizeImageToSpec(imageUri, spec.width, spec.height);
      resizedImages.push({
        uri: resizedUri,
        width: spec.width,
        height: spec.height,
        specification: spec.label,
      });
    } catch (error) {
      console.error(`Error resizing to ${spec.label}:`, error);
      // Continue with other specs even if one fails
    }
  }
  
  if (resizedImages.length === 0) {
    throw new Error('Failed to resize image to any specification');
  }

  return resizedImages;
}

export async function resizeImageToSelectedSpecs(imageUri: string, selectedSpecs: AppStoreSpec[]) {
  if (!imageUri) {
    throw new Error('Image URI is required');
  }

  if (!selectedSpecs || selectedSpecs.length === 0) {
    throw new Error('No specifications selected');
  }

  const resizedImages = [];
  
  for (const spec of selectedSpecs) {
    try {
      const resizedUri = await resizeImageToSpec(imageUri, spec.width, spec.height);
      resizedImages.push({
        uri: resizedUri,
        width: spec.width,
        height: spec.height,
        specification: spec.label,
      });
    } catch (error) {
      console.error(`Error resizing to ${spec.label}:`, error);
      // Continue with other specs even if one fails
    }
  }
  
  if (resizedImages.length === 0) {
    throw new Error('Failed to resize image to any specification');
  }

  return resizedImages;
}
