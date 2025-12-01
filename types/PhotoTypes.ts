
export interface UploadedPhoto {
  id: string;
  uri: string;
  width: number;
  height: number;
  fileName: string;
}

export interface ResizedPhoto {
  id: string;
  originalId: string;
  uri: string;
  width: number;
  height: number;
  specification: string;
}

export interface AppMetadata {
  promotionalText: string;
  description: string;
  keywords: string[];
}

export interface AppStoreSpec {
  width: number;
  height: number;
  label: string;
}

export const APP_STORE_SPECS: AppStoreSpec[] = [
  { width: 1242, height: 2688, label: '6.5" Display (Portrait)' },
  { width: 1284, height: 2778, label: '6.7" Display (Portrait)' },
  { width: 2064, height: 2752, label: '12.9" iPad Pro (Portrait)' },
  { width: 2048, height: 2732, label: '12.9" iPad Pro (2nd Gen)' },
];
