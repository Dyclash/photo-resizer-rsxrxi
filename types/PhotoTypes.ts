
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

export const APP_STORE_SPECS = [
  { width: 1242, height: 2688, label: '6.5" Display (Portrait)' },
  { width: 2688, height: 1242, label: '6.5" Display (Landscape)' },
  { width: 1284, height: 2778, label: '6.7" Display (Portrait)' },
  { width: 2778, height: 1284, label: '6.7" Display (Landscape)' },
];
