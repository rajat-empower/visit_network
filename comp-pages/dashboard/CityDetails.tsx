'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getApiUrl, ENDPOINTS } from '@/utils/api-config';
import PageTitle from "@/components/PageTitle";
import { Loader2, RefreshCw } from "lucide-react";

interface CityDetails {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
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

const CityDetails: React.FC = () => {
  const params = useParams();
  const cityId = params?.cityId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [cityDetails, setCityDetails] = useState<CityDetails | null>(null);

  useEffect(() => {
    fetchCityDetails();
  }, [cityId]);

  const fetchCityDetails = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(getApiUrl(`${ENDPOINTS.LOCATIONS.CITIES}/${cityId}`));
      const data = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message);
      }

      setCityDetails(data.data);
      toast.success('City details loaded successfully');
    } catch (error) {
      console.error('Error fetching city details:', error);
      toast.error('Failed to load city details', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!cityDetails) return;

    const { name, value } = e.target;
    setCityDetails({
      ...cityDetails,
      [name]: value
    });
  };

  const handleSave = async () => {
    if (!cityDetails) return;

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

      toast.success('City details updated successfully');
    } catch (error) {
      console.error('Error updating city details:', error);
      toast.error('Failed to update city details', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerateImage = async () => {
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
      toast.success('City image regenerated successfully');
    } catch (error) {
      console.error('Error regenerating city image:', error);
      toast.error('Failed to regenerate city image', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsGeneratingImage(false);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
};

export default CityDetails; 