export type ImportSource = 'VIATOR_API';

export type ImportCategory = 'TOURS' | 'PLACES_TO_STAY' | 'RESTAURANTS';

export interface LocationType {
  id: string;
  name: string;
  type: 'COUNTRY' | 'REGION' | 'CITY';
  parentId?: string;
}

export interface ImportLocation {
  id: string;
  name: string;
  type: LocationType;
  parentId?: string;
  destinationId?: string;
  matched?: boolean;
  matchedCity?: {
    id: string;
    name: string;
  };
}

export interface ImportPreview {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  cityId: string;
  cityName: string;
  images: string[];
  selected: boolean;
}

export interface ImportConfig {
  category: ImportCategory;
  source: ImportSource;
  locations: ImportLocation[];
  limit: number;
  preview: ImportPreview[];
}

export interface ImportProgress {
  total: number;
  current: number;
  failed: number;
  status: 'idle' | 'verifying' | 'previewing' | 'importing' | 'completed' | 'error';
  message?: string;
} 