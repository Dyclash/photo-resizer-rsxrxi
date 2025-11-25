
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PHOTOS: '@app_photos',
  RESIZED_PHOTOS: '@app_resized_photos',
  METADATA: '@app_metadata',
  STATS: '@app_stats',
};

export interface AppStats {
  photosResized: number;
  appsPublished: number;
  downloads: number;
}

export const storage = {
  async savePhotos(photos: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
      console.log('Photos saved to storage');
    } catch (error) {
      console.error('Error saving photos:', error);
    }
  },

  async getPhotos() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting photos:', error);
      return [];
    }
  },

  async saveResizedPhotos(photos: any[]) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.RESIZED_PHOTOS, JSON.stringify(photos));
      console.log('Resized photos saved to storage');
    } catch (error) {
      console.error('Error saving resized photos:', error);
    }
  },

  async getResizedPhotos() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RESIZED_PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting resized photos:', error);
      return [];
    }
  },

  async saveMetadata(metadata: any) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(metadata));
      console.log('Metadata saved to storage');
    } catch (error) {
      console.error('Error saving metadata:', error);
    }
  },

  async getMetadata() {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.METADATA);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting metadata:', error);
      return null;
    }
  },

  async saveStats(stats: AppStats) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      console.log('Stats saved to storage');
    } catch (error) {
      console.error('Error saving stats:', error);
    }
  },

  async getStats(): Promise<AppStats> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : { photosResized: 0, appsPublished: 0, downloads: 0 };
    } catch (error) {
      console.error('Error getting stats:', error);
      return { photosResized: 0, appsPublished: 0, downloads: 0 };
    }
  },

  async incrementPhotoCount(count: number) {
    try {
      const stats = await this.getStats();
      stats.photosResized += count;
      await this.saveStats(stats);
      console.log('Photo count incremented:', stats.photosResized);
    } catch (error) {
      console.error('Error incrementing photo count:', error);
    }
  },

  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PHOTOS,
        STORAGE_KEYS.RESIZED_PHOTOS,
        STORAGE_KEYS.METADATA,
      ]);
      console.log('All app data cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing app data:', error);
      return false;
    }
  },

  async resetApp() {
    try {
      await AsyncStorage.clear();
      console.log('App reset successfully - all storage cleared');
      return true;
    } catch (error) {
      console.error('Error resetting app:', error);
      return false;
    }
  },
};
