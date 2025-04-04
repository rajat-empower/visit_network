export interface Tour {
    productCode:string;
    countryName: string;
    id: string;
    viator_id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    duration: string;
    cityId: string;
    cityName: string;
    destinationId: string;
    images: string[];
    bookingType: string;
    cancellationPolicy: string;
    highlights: string[];
    inclusions: string[];
    exclusions: string[];
    additionalInfo: string[];
    startingTime: string;
    languages: string[];
    categories: string[];
    rating: number | null;
    reviewCount: number;
    bookingLink: string;
    isFeatured: boolean;
    totalCount: string;
    status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TourImage {
    id: string;
    tourId: string;
    url: string;
    cdnUrl: string;
    isMain: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TourCategory {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TourType {
    id: string;
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
  } 