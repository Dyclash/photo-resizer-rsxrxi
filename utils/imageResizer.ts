
import * as ImageManipulator from 'expo-image-manipulator';
import { APP_STORE_SPECS } from '../types/PhotoTypes';

export async function resizeImageToSpec(
  imageUri: string,
  targetWidth: number,
  targetHeight: number
): Promise<string> {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: targetWidth, height: targetHeight } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );
    return result.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
}

export async function resizeImageToAllSpecs(imageUri: string) {
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
    }
  }
  
  return resizedImages;
}
