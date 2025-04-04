export interface ViatorDestination {
  destinationId: string;
  destinationName: string;
  destinationType: 'COUNTRY' | 'CITY' | 'REGION';
  parentId?: string;
  countryName?: string;
  timeZone: string;
  iataCode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  sortOrder?: number;
  lookupId?: string;
  defaultCurrency?: string;
  defaultLanguage?: string;
  population?: number;
}

export interface ViatorTour {
  //productCode: (arg0: string, productCode: any) => { error: any; } | PromiseLike<{ error: any; }>;
  productCode: string;
  id: string;
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
  };
  duration: {
    text: string;
  };
  location: {
    country: string;
    id: string;
    name: string;
  };
  images: {
    url: string;
  }[];
  bookingInfo: {
    type: string;
    cancellationPolicy: string;
  };
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  additionalInfo: string[];
  startingTime: string;
  languages: string[];
  categories: {
    name: string;
  }[];
  rating?: {
    overall: number;
    reviewCount: number;
  };
  bookingLink?: string;totalCount: number;
}

export interface ViatorPaginatedResponse<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ViatorResponse<T> {
  status: string;
  data: T;
  message?: string;
} 