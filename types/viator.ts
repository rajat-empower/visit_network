export interface ViatorDestination {
  destinationId: string;
  destinationName: string;
  destinationType: string;
  parentId: string | null;
  countryName?: string;
  timeZone: string;
  iataCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  sortOrder?: number;
  lookupId?: string;
  population?: number;
} 