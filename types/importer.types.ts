export type ImportCategory = 'TOURS' | 'PLACES_TO_STAY' | 'RESTAURANTS';
export type ImportSource = 'VIATOR_API';

export interface ImportLocation {
  id: string;
  name: string;
  type: {
    id: string;
    name: string;
    type: string;
  };
  cities: string[];
  matched?: boolean;
  matchedCity?: {
    name: string;
  };
}

export interface ImportPreview {
  id: string;
  title: string;
  cityName: string;
  price: number;
  currency: string;
  duration: string;
  selected: boolean;
}

export interface ImportProgress {
  total: number;
  current: number;
  failed: number;
  status: 'idle' | 'verifying' | 'previewing' | 'importing' | 'completed' | 'error';
  message?: string;
} 