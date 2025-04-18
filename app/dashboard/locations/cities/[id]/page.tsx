'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { getApiUrl, ENDPOINTS } from '@/utils/api-config';
import PageTitle from "@/components/PageTitle";
import { Loader2, RefreshCw } from "lucide-react";

interface CityDetails {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  area?: number;
  founded?: string;
  food?: string;
  transport?: string;
  popularity?: string;
  bestvisit?: string;
  toptourist?: string;
  annualevents?: string;
  type: string;
  region: string;
  viator_id: string;
  active: boolean;
  destination_id: string;
  destination_name: string;
  destination_type: string;
  parent_id?: string;
  time_zone?: string;
  iata_code?: string;
  sort_order?: number;
  lookup_id?: string;
  population?: number;
  image_url?: string;
}

export default function CityDetailsPage() {
  const params = useParams();
  const cityId = params?.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [cityDetails, setCityDetails] = useState<CityDetails | null>(null);

  useEffect(() => {
    fetchCityDetails();
  }, [cityId]);

  const fetchCityDetails = async () => {
    const loadingToast = toast.loading('Loading city details...', {
      description: 'Fetching latest information'
    });

    try {
      setIsLoading(true);
      
      const response = await fetch(getApiUrl(`${ENDPOINTS.LOCATIONS.CITIES}/${cityId}`));
      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      setCityDetails(data.data);
      toast.success('City details loaded successfully', {
        description: `Loaded information for ${data.data.name}`
      });
    } catch (error) {
      console.error('Error fetching city details:', error);
      toast.error('Failed to load city details', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!cityDetails) return;

    const { name, value } = e.target;
    setCityDetails({
      ...cityDetails,
      [name]: value
    });
    
    // Only show toast for significant field changes like name or region
    if (['name', 'region'].includes(name)) {
      const fieldLabels: { [key: string]: string } = {
        name: 'City Name',
        region: 'Region/Country'
      };

      const fieldLabel = fieldLabels[name];
      toast.info('Important field updated', {
        description: `Updated ${fieldLabel}. Remember to save your changes.`
      });
    }
  };

  const handleSave = async () => {
    if (!cityDetails) return;

    const loadingToast = toast.loading('Saving city details...', {
      description: 'Updating database with new information'
    });

    try {
      setIsSaving(true);

      const response = await fetch(getApiUrl(`${ENDPOINTS.LOCATIONS.CITIES}/${cityId}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cityDetails),
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      toast.success('Changes saved successfully', {
        description: `All updates for ${cityDetails.name} have been saved`
      });
    } catch (error) {
      console.error('Error updating city details:', error);
      toast.error('Failed to save changes', {
        description: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    } finally {
      setIsSaving(false);
      toast.dismiss(loadingToast);
    }
  };

  const handleRegenerateImage = async () => {
    const loadingToast = toast.loading('Generating new city image...', {
      description: 'This process may take up to a minute'
    });

    try {
      setIsGeneratingImage(true);

      const response = await fetch(getApiUrl(`${ENDPOINTS.LOCATIONS.CITIES}/${cityId}/regenerate-image`), {
        method: 'POST',
      });

      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      setCityDetails(data.data);
      toast.success('New image generated', {
        description: 'The city image has been successfully updated'
      });
    } catch (error) {
      console.error('Error regenerating city image:', error);
      toast.error('Image generation failed', {
        description: error instanceof Error 
          ? error.message 
          : 'Could not generate a new image at this time'
      });
    } finally {
      setIsGeneratingImage(false);
      toast.dismiss(loadingToast);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!cityDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>City not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8">
      <Toaster 
        position="top-right" 
        richColors 
        closeButton
        expand={true}
      />
      <PageTitle 
        title="City Details" 
        description="View and edit city information" 
      />

      <Card>
        <CardHeader>
          <CardTitle>Edit City Details</CardTitle>
          <CardDescription>
            Update information for {cityDetails.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* City Image */}
          <div className="space-y-4">
            <label className="text-sm font-medium">City Image</label>
            <div className="relative">
              {cityDetails.image_url ? (
                <img
                  src={cityDetails.image_url}
                  alt={cityDetails.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">No image available</p>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                className="absolute bottom-4 right-4"
                onClick={handleRegenerateImage}
                disabled={isGeneratingImage}
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate Image
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City Name</label>
              <Input
                name="name"
                value={cityDetails.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Region/Country</label>
              <Input
                name="region"
                value={cityDetails.region}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              name="description"
              value={cityDetails.description}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {/* Location Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Latitude</label>
              <Input
                type="number"
                name="latitude"
                value={cityDetails.latitude}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Longitude</label>
              <Input
                type="number"
                name="longitude"
                value={cityDetails.longitude}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Elevation (meters)</label>
              <Input
                type="number"
                name="elevation"
                value={cityDetails.elevation || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* City Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Area (km²)</label>
              <Input
                type="number"
                name="area"
                value={cityDetails.area || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Founded Year</label>
              <Input
                name="founded"
                value={cityDetails.founded || ''}
                onChange={handleInputChange}
                placeholder="e.g., 1200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Population</label>
              <Input
                type="number"
                name="population"
                value={cityDetails.population || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Tourism Information */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Best Time to Visit</label>
            <Input
              name="bestvisit"
              value={cityDetails.bestvisit || ''}
              onChange={handleInputChange}
              placeholder="e.g., June to September"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Popular Tourist Attractions</label>
            <Textarea
              name="toptourist"
              value={cityDetails.toptourist || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="List major tourist attractions"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Annual Events</label>
            <Textarea
              name="annualevents"
              value={cityDetails.annualevents || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="List major annual events and festivals"
            />
          </div>

          {/* City Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Local Food & Cuisine</label>
              <Textarea
                name="food"
                value={cityDetails.food || ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe local food specialties"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Transportation</label>
              <Textarea
                name="transport"
                value={cityDetails.transport || ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe transportation options"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Popularity & Tourism Status</label>
            <Textarea
              name="popularity"
              value={cityDetails.popularity || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Describe the city's tourism popularity and status"
            />
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">IATA Code</label>
              <Input
                name="iata_code"
                value={cityDetails.iata_code || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Zone</label>
              <Input
                name="time_zone"
                value={cityDetails.time_zone || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 