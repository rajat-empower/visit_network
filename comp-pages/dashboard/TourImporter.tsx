'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { getApiUrl, ENDPOINTS } from '@/utils/api-config';
//import type { ImportCategory, ImportSource, ImportProgress } from '@/types/importer.types';
import type { ImportCategory, ImportSource } from '@/types/importer.types';
import PageTitle from "@/components/PageTitle";
import type { ViatorDestination } from '@/types/viator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STEPS = {
  CATEGORY: 0,
  SOURCE: 1,
  LOCATIONS: 2,
  VERIFY: 3,
  LIMIT: 4,
  PREVIEW: 5,
  IMPORT: 6
};

//type ImportSource = 'VIATOR_API' | 'MANUAL';

interface ImportPreview {
  id: string;
  title: string;
  cityName: string;
  countryName?: string;
  price: number;
  currency: string;
  duration: {
    variableDurationFromMinutes: number;
    variableDurationToMinutes: number;
  };
  selected: boolean;
  description: string;
  reviews?: {
    totalReviews: number;
    combinedAverageRating: number;
    sources?: Array<{
      provider: string;
      totalCount: number;
      averageRating: number;
    }>;
  };
  confirmationType?: string;
  productCode?: string;
  productUrl?: string;
  highlights?: string[];
  inclusions?: string[];
  exclusions?: string[];
  languages?: string[];
  startingTime?: string;
  cancellationPolicy?: string;
  bookingType?: string;
  images?: Array<{
    url: {
      imageSource?: string; caption?: string; isCover?: boolean; variants?: Array<{
        height: number;
        width: number;
        url: string;
      }>;
    };
    imageSource?: string;
    caption?: string;
    isCover?: boolean;
    variants?: Array<{
      height: number;
      width: number;
      url: string;
    }>;
  }>;
  location?: {
    city: string;
    country: string;
    iataCode?: string;
    timeZone?: string;
  };
  itineraryType?: string;
  pricing?: {
    summary: {
      fromPrice: number;
      fromPriceBeforeDiscount: number;
    };
    currency: string;
  };
  destinations?: Array<{
    ref: string;
    primary: boolean;
  }>;
  tags?: number[];
  flags?: string[];
  translationInfo?: {
    containsMachineTranslatedText: boolean;
    translationSource: string;
  };
  additionalInfo?: string[];
  categories?: string[];
}

interface LocationPreview {
  locationId: string;
  tours: ImportPreview[];
  pagination: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    pageSize: number;
  };
  isExpanded?: boolean;
}

interface PreviewResponse {
  locations: LocationPreview[];
  overall: {
    totalCount: number;
    currentPage: number;
    totalPages: number;
    hasMore: boolean;
    pageSize: number;
  };
}

interface CityDetails {
  id: string;
  matched?: boolean;
  matchedCity?: any;
}

interface ImportLocation {
  id: string;
  name: string;
  type: {
    id: string;
    name: string;
    type: string;
  };
  cities: CityDetails[];
  matched?: boolean;
  matchedCity?: { name: string };
}

interface ViatorCity {
  destinationId: string;
  destinationName: string;
  iataCode?: string;
  timeZone?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  countryName?: string;
  parentId?: string;
}

interface BatchResult {
  success: boolean;
  tour: ImportPreview;
  error?: Error;
}

interface BatchStats {
  succeeded: number;
  failed: number;
}

interface ImportMetadata {
  category: ImportCategory;
  source: ImportSource;
  imported_at: string;
  import_batch_id: string;
  selected_locations: string[];
  import_limit: number;
  original_payload: any;
}

interface ToastMessage {
  type: 'toast';
  message: string;
  description: string;
  status: 'info' | 'success' | 'warning' | 'error';
}

interface ImportProgress {
  total: number;
  current: number;
  failed: number;
  skipped: number;
  status: 'idle' | 'importing' | 'completed' | 'error' | 'verifying';
  message?: string;
}

interface ImportedDataItem {
  id: string;
  source: string;
  category: string;
  import_batch_id: string;
  status: string;
  product_code: string;
  title: string;
  city: string;
  country: string;
  created_at: string;
  metadata: {
    city_name: string;
    country_name: string;
  };
}

const ImportedDataDialog = () => {
  const [importedData, setImportedData] = useState<ImportedDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchImportedData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(ENDPOINTS.TOURS.IMPORTED_DATA));
      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      setImportedData(data.data);
      toast.success('Imported data fetched successfully');
    } catch (error) {
      console.error('Error fetching imported data:', error);
      toast.error('Failed to fetch imported data', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchImportedData();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="w-9 h-9">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Imported Data</DialogTitle>
          <DialogDescription>
            View all imported tours and their status
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            Loading imported data...
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Code</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Import Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product_code}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.metadata.city_name || item.city}</TableCell>
                  <TableCell>{item.metadata.country_name || item.country}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        item.status === 'COMPLETED' ? 'secondary' : 
                        item.status === 'PROCESSING' ? 'outline' : 
                        'destructive'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(item.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {importedData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No imported data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

const TourImporter: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.CATEGORY);
  const [category, setCategory] = useState<ImportCategory>('TOURS');
  const [source, setSource] = useState<ImportSource>('VIATOR_API');
  const [locations, setLocations] = useState<ImportLocation[]>([]);
  const [cities, setCities] = useState<ViatorCity[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [limit, setLimit] = useState(100);
  const [preview, setPreview] = useState<ImportPreview[]>([]);
  const [progress, setProgress] = useState<ImportProgress>({
    total: 0,
    current: 0,
    failed: 0,
    skipped: 0,
    status: 'idle'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [locationPreviews, setLocationPreviews] = useState<LocationPreview[]>([]);
  const [locationPages, setLocationPages] = useState<Record<string, number>>({});
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentStep === STEPS.LOCATIONS) {
      fetchLocations();
    }
  }, [currentStep]);

  const fetchLocations = async () => {
    try {
      const mappingsResponse = await fetch(getApiUrl(ENDPOINTS.LOCATIONS.MAPPINGS));
      const mappingsData = await mappingsResponse.json();
      
      if (mappingsData.status === 'error') {
        throw new Error(mappingsData.message);
      }

      const mappedLocations = mappingsData.data.countryMappings;
      const countryIds = Object.keys(mappedLocations);

      // First fetch countries data
      const countriesResponse = await fetch(getApiUrl(ENDPOINTS.LOCATIONS.COUNTRIES));
      const countriesData = await countriesResponse.json();
      
      if (countriesData.status === 'error') {
        throw new Error(countriesData.message);
      }

      const countriesMap = new Map(
        countriesData.data.items.map((country: ViatorDestination) => [
          String(country.destinationId),
          country.destinationName
        ])
      );

      // Set locations with country names
      setLocations(Object.entries(mappedLocations).map(([countryId, cityIds]) => {
        const countryName = countriesMap.get(countryId) || countryId;
        return {
          id: countryId,
          name: countryName,
          type: { 
            id: countryId, 
            name: countryName, 
            type: 'COUNTRY' 
          },
          cities: (cityIds as string[]).map(cityId => ({
            id: cityId,
            matched: false,
            matchedCity: null
          }))
        } as ImportLocation;
      }));

      // Set selected locations as just the city IDs
      const allCityIds = Object.values(mappedLocations).flat() as string[];
      setSelectedLocations(allCityIds);

      // Fetch cities data
      if (countryIds.length > 0) {
        const citiesResponse = await fetch(
          getApiUrl(`${ENDPOINTS.LOCATIONS.CITIES}?parentId=${countryIds.join(',')}`),
          {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        const citiesData = await citiesResponse.json();
        
        if (citiesData.status === 'success') {
          setCities(citiesData.data.items);
        } else if (citiesData.status === 'error') {
          throw new Error(citiesData.message);
        }
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Failed to load locations', {
        description: error instanceof Error ? error.message : 'Could not load mapped locations'
      });
    }
  };

  const verifyLocations = async () => {
    if (selectedLocations.length === 0) {
      toast.warning('No locations selected', {
        description: 'Please select at least one location to verify'
      });
      return;
    }

    setProgress({ ...progress, status: 'verifying' });
    try {
      const response = await fetch(getApiUrl(ENDPOINTS.TOURS.VERIFY), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locations: selectedLocations, limit: limit })
      });
      
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);
      
      // Update locations with verification status
      const updatedLocations = locations.map(loc => {
        const updatedCities = loc.cities.map(city => ({
          ...city,
          matched: selectedLocations.includes(city.id) && data.data.matches[city.id] !== undefined,
          matchedCity: selectedLocations.includes(city.id) ? data.data.matches[city.id] : null
        }));

        return {
          ...loc,
          cities: updatedCities,
          matched: updatedCities.some(city => city.matched),
          matchedCity: updatedCities.find(city => city.matched)?.matchedCity
        };
      });

      setLocations(updatedLocations);
      
      // Check if any selected locations failed verification
      const failedLocations = selectedLocations.filter(cityId => !data.data.matches[cityId]);
      if (failedLocations.length > 0) {
        const failedCities = failedLocations.map(cityId => {
          const city = cities.find(c => c.destinationId === cityId);
          return city?.destinationName || cityId;
        }).join(', ');
        
        toast.warning('Some locations failed verification', {
          description: `The following locations could not be verified: ${failedCities}`
        });
      }
      
      setProgress({ ...progress, status: 'idle' });
      setCurrentStep(STEPS.LIMIT);
    } catch (error) {
      console.error('Error verifying locations:', error);
      toast.error('Location verification failed', {
        description: error instanceof Error ? error.message : 'Could not verify locations'
      });
      setProgress({ ...progress, status: 'error' });
    }
  };

  const fetchPreview = async (locationId?: string, page: number = 1) => {
    if (selectedLocations.length === 0) {
      toast.warning('No locations selected', {
        description: 'Please select at least one location to preview'
      });
      return;
    }

    setProgress({ ...progress, status: 'importing' });
    try {
      const locationsToFetch = locationId ? [locationId] : selectedLocations;
      
      const response = await fetch(getApiUrl(ENDPOINTS.TOURS.PREVIEW), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locations: locationsToFetch,
          page,
          limit: limit,
          pageSize: limit
        })
      });
      
      const data = await response.json();
      if (data.status === 'error') throw new Error(data.message);

      // Mark all tours as selected by default
      const locationsWithSelectedTours = data.data.locations.map((loc: LocationPreview) => ({
        ...loc,
        tours: loc.tours.map((tour: ImportPreview) => ({ ...tour, selected: true }))
      }));

      if (locationId) {
        // Update single location
        setLocationPreviews(prev => 
          prev.map(loc => 
            loc.locationId === locationId ? locationsWithSelectedTours[0] : loc
          )
        );
      } else {
        // Update all locations
        setLocationPreviews(locationsWithSelectedTours);
        // Initialize pagination state for each location
        const initialPages = locationsWithSelectedTours.reduce((acc: Record<string, number>, loc: LocationPreview) => {
          acc[loc.locationId] = 1;
          return acc;
        }, {});
        setLocationPages(initialPages);
      }
      
      setProgress({ ...progress, status: 'idle' });
      setCurrentStep(STEPS.PREVIEW);

      toast.success('Preview loaded successfully', {
        description: `Loaded ${locationsWithSelectedTours.reduce((sum: number, loc: LocationPreview) => sum + loc.tours.length, 0)} tours from ${locationsWithSelectedTours.length} locations`
      });
    } catch (error) {
      console.error('Error fetching preview:', error);
      toast.error('Preview failed', {
        description: error instanceof Error ? error.message : 'Could not fetch preview data'
      });
      setProgress({ ...progress, status: 'error' });
    }
  };

  const handleLocationPageChange = async (locationId: string, newPage: number) => {
    setLocationPages(prev => ({ ...prev, [locationId]: newPage }));
    await fetchPreview(locationId, newPage);
  };

  const startImport = async () => {
    try {
      setCurrentStep(STEPS.IMPORT);
      setProgress({
        total: selectedLocations.length * limit,
        current: 0,
        failed: 0,
        skipped: 0,
        status: 'importing',
        message: 'Starting import...'
      });

      const response = await fetch(getApiUrl(ENDPOINTS.TOURS.IMPORT), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          source,
          selectedLocations,
          limit,
          pages: locationPages
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response reader');
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the stream chunk to text
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        // Process each line
        for (const line of lines) {
          try {
            const data = JSON.parse(line) as ToastMessage | { 
              type: 'summary'; 
              status: 'success' | 'error'; 
              data: { 
                total: number; 
                imported: number; 
                failed: number; 
                skipped: number; 
              }; 
              message: string; 
            };
            
            if (data.type === 'toast') {
              // Show toast message
              const toastFn = toast[data.status] || toast.info;
              toastFn(data.message, {
                description: data.description
              });

              // Update progress based on message content
              setProgress(prev => {
                const newProgress = { ...prev };

                if (data.message.includes('Tour Imported')) {
                  newProgress.current += 1;
                } else if (data.message.includes('Tour Exists')) {
                  newProgress.skipped += 1;
                } else if (data.status === 'error') {
                  newProgress.failed += 1;
                }

                // Update message
                newProgress.message = data.message;

                return newProgress;
              });
            } else if (data.type === 'summary') {
              // Update final progress
              setProgress(prev => ({
                ...prev,
                current: data.data.imported,
                failed: data.data.failed,
                skipped: data.data.skipped,
                total: data.data.total,
                status: data.status === 'error' ? 'error' : 'completed',
                message: data.message
              }));

              // Show final toast
              const toastFn = data.status === 'error' ? toast.error : toast.success;
              toastFn(data.message);
            }
          } catch (error) {
            console.error('Error processing stream line:', error);
          }
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
      setProgress(prev => ({
        ...prev,
        status: 'error',
        message: error instanceof Error ? error.message : 'Import failed'
      }));
      toast.error('Import failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  const toggleLocationExpanded = (locationId: string) => {
    setExpandedLocations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(locationId)) {
        newSet.delete(locationId);
      } else {
        newSet.add(locationId);
      }
      return newSet;
    });
  };

  const handleStepChange = async (nextStep: number) => {
    setIsLoading(true);
    try {
      switch (nextStep) {
        case STEPS.SOURCE:
          toast.success('Category selected', {
            description: `Selected category: ${category}`
          });
          setCurrentStep(nextStep);
          break;

        case STEPS.LOCATIONS:
          toast.success('Source selected', {
            description: `Selected source: ${source}`
          });
          setCurrentStep(nextStep);
          break;

        case STEPS.VERIFY:
          toast.info('Verifying locations...', {
            description: 'Please wait while we verify the selected locations'
          });
          await verifyLocations();
          break;

        case STEPS.LIMIT:
          toast.success('Locations verified', {
            description: 'All selected locations have been verified'
          });
          setCurrentStep(nextStep);
          break;

        case STEPS.PREVIEW:
          toast.info('Loading preview...', {
            description: 'Fetching tour data for selected locations'
          });
          await fetchPreview();
          break;

        case STEPS.IMPORT:
          toast.info('Starting import process...', {
            description: 'Beginning the import of selected tours'
          });
          await startImport();
          break;

        default:
          setCurrentStep(nextStep);
      }
    } catch (error) {
      console.error('Error during step change:', error);
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'An error occurred while processing your request'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.CATEGORY:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Category</h3>
            <Select value={category} onValueChange={(value: ImportCategory) => setCategory(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TOURS">Tours</SelectItem>
                <SelectItem value="PLACES_TO_STAY">Places to Stay</SelectItem>
                <SelectItem value="RESTAURANTS">Restaurants</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={() => handleStepChange(STEPS.SOURCE)}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </div>
              ) : 'Next'}
            </Button>
          </div>
        );

      case STEPS.SOURCE:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Source</h3>
            <Select value={source} onValueChange={(value: ImportSource) => setSource(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VIATOR_API">Viator API</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleStepChange(STEPS.CATEGORY)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={() => handleStepChange(STEPS.LOCATIONS)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </div>
                ) : 'Next'}
              </Button>
            </div>
          </div>
        );

      case STEPS.LOCATIONS:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Select Locations</h3>
            <div className="border rounded-md p-4 max-h-[400px] overflow-y-auto">
              {/* All Cities Option */}
              <div className="flex items-center space-x-2 py-2 border-b mb-2">
                <Checkbox
                  checked={locations.every(location => 
                    location.cities.every(city => selectedLocations.includes(city.id))
                  )}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      const allCityIds = locations.flatMap(location => 
                        location.cities.map(city => city.id)
                      );
                      setSelectedLocations(allCityIds);
                    } else {
                      setSelectedLocations([]);
                    }
                  }}
                />
                <span className="font-medium">All Cities</span>
              </div>

              {/* Individual Locations */}
              {locations.map((location) => (
                <div key={location.id} className="mb-4">
                  <div className="flex items-center mb-2">
                    <Checkbox
                      checked={location.cities.every((city) => selectedLocations.includes(city.id))}
                      onCheckedChange={(checked) => {
                        const cityIds = location.cities.map((city) => city.id);
                        if (checked) {
                          setSelectedLocations((prev) => [...new Set([...prev, ...cityIds])]);
                        } else {
                          setSelectedLocations((prev) => prev.filter((id) => !cityIds.includes(id)));
                        }
                      }}
                    />
                    {/* Find the country details from cities data */}
                    {(() => {
                      const countryCity = cities.find(c => String(c.parentId) === String(location.id));
                      return (
                        <span className="ml-2 font-medium">
                          {countryCity?.countryName || location.name}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="pl-6">
                    {location.cities.map((city) => {
                      const cityDetails = cities.find((c) => c.destinationId === city.id);
                      return (
                        <div key={city.id} className="flex items-center mb-2">
                          <Checkbox
                            checked={selectedLocations.includes(city.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedLocations((prev) => [...prev, city.id]);
                              } else {
                                setSelectedLocations((prev) => prev.filter((id) => id !== city.id));
                              }
                            }}
                          />
                          <div className="ml-2">
                            <div className="font-medium">
                              {cityDetails?.destinationName || city.id}
                              {cityDetails?.iataCode && ` (${cityDetails.iataCode})`}
                            </div>
                            {cityDetails && (
                              <div className="text-sm text-gray-500">
                                {cityDetails.timeZone && `Timezone: ${cityDetails.timeZone}`}
                                {cityDetails.coordinates && ` • Coordinates: ${cityDetails.coordinates.latitude}, ${cityDetails.coordinates.longitude}`}
                              </div>
                            )}
                            {city.matched && (
                              <div className="text-sm text-green-600">
                                Matched with: {city.matchedCity?.name}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* No Locations Message */}
            {locations.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No locations available. Please configure location mappings first.
              </div>
            )}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleStepChange(STEPS.SOURCE)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={() => handleStepChange(STEPS.VERIFY)}
                disabled={isLoading || selectedLocations.length === 0}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Verifying...
                  </div>
                ) : 'Next'}
              </Button>
            </div>
          </div>
        );

      case STEPS.VERIFY:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Verify Locations</h3>
            {progress.status === 'verifying' ? (
              <div className="text-center py-4">
                <Progress value={progress.current / progress.total * 100} />
                <p className="mt-2">Verifying locations...</p>
              </div>
            ) : (
              <div className="border rounded-md p-4 max-h-[400px] overflow-y-auto">
                {locations.map((location) => (
                  <div key={location.id} className="py-2">
                    <div className="flex items-center justify-between">
                      <span>{location.name}</span>
                      <span className={location.matched ? 'text-green-500' : 'text-red-500'}>
                        {location.matched ? 'Matched' : 'Not matched'}
                      </span>
                    </div>
                    {location.matchedCity && (
                      <p className="text-sm text-gray-500">
                        Matched with: {location.matchedCity.name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleStepChange(STEPS.LOCATIONS)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={() => handleStepChange(STEPS.LIMIT)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </div>
                ) : 'Next'}
              </Button>
            </div>
          </div>
        );

      case STEPS.LIMIT:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Set Import Limit</h3>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={limit}
                onChange={(e) => setLimit(parseInt(e.target.value) || 100)}
                min={1}
                max={1000}
              />
              <span className="text-sm text-gray-500">Products per city</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleStepChange(STEPS.VERIFY)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={() => handleStepChange(STEPS.PREVIEW)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading...
                  </div>
                ) : 'Next'}
              </Button>
            </div>
          </div>
        );

      case STEPS.PREVIEW:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preview Items</h3>

            {/* Selected Values Summary */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Selected Options</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Category:</span>
                  <p className="text-sm font-medium">{category}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Source:</span>
                  <p className="text-sm font-medium">{source}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Selected Cities:</span>
                  <p className="text-sm font-medium">{selectedLocations.length} cities</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Limit per City:</span>
                  <p className="text-sm font-medium">{limit} tours</p>
                </div>
              </div>
            </div>

            {/* Location Tables */}
            {locationPreviews.map((locationPreview) => {
              const city = cities.find(c => String(c.destinationId) === locationPreview.locationId);
              const isExpanded = expandedLocations.has(locationPreview.locationId);
              
              return (
                <Card key={locationPreview.locationId} className="mb-6">
                  <CardHeader 
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleLocationExpanded(locationPreview.locationId)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span>{city?.destinationName || locationPreview.tours[0]?.location?.city || 'Unknown City'}</span>
                          <span className="text-sm text-gray-500">
                            ({locationPreview.pagination.totalCount || 0} Products)
                          </span>
                        </CardTitle>
                        {(city?.countryName || locationPreview.tours[0]?.location?.country) && (
                          <CardDescription>
                            {city?.countryName || locationPreview.tours[0]?.location?.country}
                          </CardDescription>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        {isExpanded ? (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m18 15-6-6-6 6"/>
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m6 9 6 6 6-6"/>
                          </svg>
                        )}
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="text-sm text-gray-500">
                        Page {locationPages[locationPreview.locationId] || 1} of {Math.max(1, locationPreview.pagination.totalPages)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {locationPreview.pagination.totalCount > 0 ? (
                          `${((locationPages[locationPreview.locationId] || 1) - 1) * locationPreview.pagination.pageSize + 1} - ${Math.min((locationPages[locationPreview.locationId] || 1) * locationPreview.pagination.pageSize, locationPreview.pagination.totalCount)} of ${locationPreview.pagination.totalCount}`
                        ) : (
                          'No tours available'
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  {isExpanded && (
                    <CardContent>
                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">
                                <Checkbox
                                  checked={locationPreview.tours.every(item => item.selected)}
                                  onCheckedChange={(checked) => {
                                    setLocationPreviews(prev =>
                                      prev.map(loc =>
                                        loc.locationId === locationPreview.locationId
                                          ? {
                                              ...loc,
                                              tours: loc.tours.map(tour => ({ ...tour, selected: !!checked }))
                                            }
                                          : loc
                                      )
                                    );
                                  }}
                                />
                              </TableHead>
                              <TableHead className="w-[50px]">#</TableHead>
                              <TableHead className="w-[200px]">Images</TableHead>
                              <TableHead>Title & Details</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Booking Info</TableHead>                             
                              <TableHead className="w-[200px]">Product Info</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {locationPreview.tours.map((item, index) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <Checkbox
                                    checked={item.selected}
                                    onCheckedChange={(checked) => {
                                      setLocationPreviews(prev =>
                                        prev.map(loc =>
                                          loc.locationId === locationPreview.locationId
                                            ? {
                                                ...loc,
                                                tours: loc.tours.map(tour =>
                                                  tour.id === item.id ? { ...tour, selected: !!checked } : tour
                                                )
                                              }
                                            : loc
                                        )
                                      );
                                    }}
                                  />
                                </TableCell>
                                <TableCell className="text-sm text-gray-500">
                                  {((locationPages[locationPreview.locationId] || 1) - 1) * locationPreview.pagination.pageSize + index + 1}
                                </TableCell>
                                <TableCell>
                                  {item.images && item.images.length > 0 ? (
                                    <div className="flex gap-1 overflow-x-auto max-w-[200px]">
                                      {item.images.slice(0, 4).map((imageUrl, imgIndex) => (
                                        <div key={imgIndex} className="relative min-w-[80px] h-20 rounded-md overflow-hidden group">
                                          <img
                                            src={typeof imageUrl === 'string' ? imageUrl : (imageUrl as any).url}
                                            alt={`${item.title} - Image ${imgIndex + 1}`}
                                            className="object-cover w-full h-full hover:scale-110 transition-transform duration-200"
                                          />
                                          {imgIndex === 3 && item.images && item.images.length > 4 && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm">
                                              +{item.images.length - 4} more
                                            </div>
                                          )}
                                          <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[10px] text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {imgIndex + 1}/{item.images ? Math.min(4, item.images.length) : 1}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="w-20 h-20 bg-gray-100 rounded-md flex items-center justify-center">
                                      <span className="text-xs text-gray-400">No image</span>
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="font-medium">{item.title}</div>
                                    <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
                                    {item.highlights && item.highlights.length > 0 && (
                                      <div className="text-xs text-gray-600 mt-2">
                                        <strong>Highlights:</strong>
                                        <ul className="list-disc list-inside">
                                          {item.highlights.slice(0, 2).map((highlight, idx) => (
                                            <li key={idx} className="line-clamp-1">{highlight}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-medium">{item.location?.city || city?.destinationName}</span>
                                      <span className="text-xs text-gray-500">{item.location?.country || city?.countryName}</span>
                                    </div>
                                    {(item.location?.iataCode || city?.iataCode) && (
                                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        {item.location?.iataCode || city?.iataCode}
                                      </span>
                                    )}
                                    {(item.location?.timeZone || city?.timeZone) && (
                                      <div className="text-xs text-gray-500">
                                        {item.location?.timeZone || city?.timeZone}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="text-sm">
                                      <span className="font-medium">{item.price}</span> {item.currency}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {typeof item.duration === 'string' ? item.duration : 
                                        `${item.duration.variableDurationFromMinutes}-${item.duration.variableDurationToMinutes} minutes`
                                      }
                                    </div>
                                    {item.startingTime && (
                                      <div className="text-xs text-gray-500">
                                        Starts at: {item.startingTime}
                                      </div>
                                    )}
                                    <div className="flex flex-col gap-1">
                                      {item.bookingType && (
                                        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                          {item.bookingType}
                                        </span>
                                      )}
                                      {item.cancellationPolicy && (
                                        <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/10">
                                          {item.cancellationPolicy}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </TableCell>                               
                                <TableCell>
                                  <div className="space-y-2">
                                    <div className="text-xs font-medium">Product Code:</div>
                                    <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                                      {item.productCode || item.id}
                                    </div>
                                    {item.productUrl && (
                                      <a 
                                        href={item.productUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-xs inline-flex items-center gap-1 mt-1"
                                      >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        View Product
                                      </a>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="space-y-2">
                                    {item.productUrl && (
                                      <a 
                                        href={item.productUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                                      >
                                        View Details
                                      </a>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Location-specific Pagination */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLocationPageChange(locationPreview.locationId, (locationPages[locationPreview.locationId] || 1) - 1)}
                            disabled={locationPages[locationPreview.locationId] === 1}
                          >
                            Previous
                          </Button>
                          <div className="flex items-center gap-2">
                            {Array.from(
                              { length: Math.min(5, locationPreview.pagination.totalPages) },
                              (_, i) => {
                                const currentPage = locationPages[locationPreview.locationId] || 1;
                                const totalPages = locationPreview.pagination.totalPages;
                                
                                let pages = [];
                                if (totalPages <= 5) {
                                  pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                                } else {
                                  if (currentPage <= 3) {
                                    pages = [1, 2, 3, '...', totalPages];
                                  } else if (currentPage >= totalPages - 2) {
                                    pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
                                  } else {
                                    pages = [1, '...', currentPage, '...', totalPages];
                                  }
                                }
                                
                                const page = pages[i];
                                if (page === '...') {
                                  return <span key={`ellipsis-${i}`} className="px-2">...</span>;
                                }
                                
                                return (
                                  <Button
                                    key={page}
                                    variant={currentPage === page ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => handleLocationPageChange(locationPreview.locationId, page as number)}
                                  >
                                    {page}
                                  </Button>
                                );
                              }
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLocationPageChange(
                              locationPreview.locationId,
                              (locationPages[locationPreview.locationId] || 1) + 1
                            )}
                            disabled={locationPages[locationPreview.locationId] === locationPreview.pagination.totalPages}
                          >
                            Next
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => handleStepChange(STEPS.LIMIT)}
                disabled={isLoading}
              >
                Back
              </Button>
              <Button 
                onClick={() => handleStepChange(STEPS.IMPORT)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Starting Import...
                  </div>
                ) : 'Start Import'}
              </Button>
            </div>
          </div>
        );

      case STEPS.IMPORT:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Import Progress</h3>
            <div className="text-center py-4">
              <Progress 
                value={progress.total > 0 ? (progress.current / progress.total) * 100 : 0} 
                className="h-2"
              />
              <div className="mt-4 space-y-2">
                <p className="font-medium">
                  {progress.status === 'completed' ? (
                    <span className="text-green-600">Import Complete</span>
                  ) : progress.status === 'error' ? (
                    <span className="text-red-600">Import Failed</span>
                  ) : (
                    `Importing ${progress.current} of ${progress.total} tours...`
                  )}
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{progress.current}</p>
                    <p className="text-sm text-gray-500">Imported</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{progress.skipped}</p>
                    <p className="text-sm text-gray-500">Skipped</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{progress.failed}</p>
                    <p className="text-sm text-gray-500">Failed</p>
                  </div>
                </div>
                {progress.message && (
                  <p className="text-sm text-gray-600 mt-4">{progress.message}</p>
                )}
              </div>
            </div>
            {progress.status === 'completed' && (
              <div className="flex justify-center mt-6">
                <Button onClick={() => handleStepChange(STEPS.CATEGORY)}>
                  Start New Import
                </Button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6" style={{ paddingTop: '25px' }}>
      <div className="flex justify-between items-center">
        <PageTitle 
          title="Tour Importer" 
          description="Import tours from external sources" 
        />
        <ImportedDataDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Universal Importer</CardTitle>
          <CardDescription>
            Follow the steps to import data from selected sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default TourImporter; 