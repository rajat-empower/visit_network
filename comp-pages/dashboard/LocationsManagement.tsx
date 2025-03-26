"use client";

import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Settings } from "lucide-react";
import Link from "next/link";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface City {
  id: number;
  name: string;
  region: string;
}

interface RegionCityMap {
  [region: string]: number[];
}

const LocationsManagement: React.FC = () => {
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<RegionCityMap>({});
  const [loading, setLoading] = useState(false);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch cities whenever selected countries change
  useEffect(() => {
    if (selectedCountries.length > 0) {
      fetchCities();
    } else {
      setCities([]);
      setSelectedCities({});
    }
  }, [selectedCountries]);

  const fetchCountries = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/locations/countries');
      if (!response.ok) throw new Error('Failed to fetch countries');
      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries');
    }
  };

  const fetchCities = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/locations/cities?countries=${selectedCountries.join(',')}`);
      if (!response.ok) throw new Error('Failed to fetch cities');
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to fetch cities');
    }
  };

  const handleCountrySelect = (country: string) => {
    if (!selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
      setSelectedCities(prev => ({
        ...prev,
        [country]: []
      }));
    }
    setOpen(false);
  };

  const removeCountry = (countryToRemove: string) => {
    setSelectedCountries(selectedCountries.filter(country => country !== countryToRemove));
    setSelectedCities(prev => {
      const newSelected = { ...prev };
      delete newSelected[countryToRemove];
      return newSelected;
    });
  };

  const toggleCity = (cityId: number, region: string) => {
    setSelectedCities(prev => {
      const newSelected = { ...prev };
      if (!newSelected[region]) {
        newSelected[region] = [];
      }
      
      if (newSelected[region].includes(cityId)) {
        newSelected[region] = newSelected[region].filter(id => id !== cityId);
      } else {
        newSelected[region] = [...newSelected[region], cityId];
      }

      // Remove region if no cities are selected
      if (newSelected[region].length === 0) {
        delete newSelected[region];
      }

      return newSelected;
    });
  };

  const handleSaveMapping = async () => {
    if (Object.keys(selectedCities).length === 0) {
      toast.error('Please select at least one city');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/locations/mapping', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          mappings: selectedCities
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save mapping');
      }
      
      const data = await response.json();
      toast.success('Successfully saved city mapping');
      
      // Reset selections after successful save
      setSelectedCountries([]);
      setSelectedCities({});
      setCities([]);
    } catch (error) {
      console.error('Error saving mapping:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save city mapping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ paddingTop: '25px' }}>
      <PageTitle 
        title="Locations Management" 
        description="Manage countries and cities for your network" 
      />

      <Card>
        <CardHeader>
          <CardTitle>Manage Locations</CardTitle>
          <CardDescription>
            Select countries and manage their cities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Country Selector */}
          <div className="space-y-4">
            <label className="text-sm font-medium">Select Countries</label>
            <div className="border rounded-md p-2 min-h-[80px] w-[300px]">
              <div className="flex flex-wrap gap-2">
                {selectedCountries.map((country) => (
                  <Badge key={country} variant="secondary" className="flex items-center gap-1">
                    <button
                      onClick={() => removeCountry(country)}
                      className="text-xs hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                    {country}
                  </Badge>
                ))}
              </div>
              
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-start text-left mt-1"
                  >
                    Select countries...
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search countries..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country}
                          onSelect={() => handleCountrySelect(country)}
                        >
                          {country}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Cities List */}
          <div>
            <h3 className="text-sm font-medium mb-4">Cities</h3>
            <div className="border rounded-md divide-y">
              {cities.map((city) => (
                <div
                  key={city.id}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedCities[city.region]?.includes(city.id)}
                      onCheckedChange={() => toggleCity(city.id, city.region)}
                    />
                    <span>{city.name}</span>
                    <Badge variant="outline">{city.region}</Badge>
                  </div>
                  <Link
                    href={`/dashboard/locations/cities/${city.id}`}
                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Settings className="w-4 h-4 mr-1" />
                    Manage
                  </Link>
                </div>
              ))}
              {cities.length === 0 && selectedCountries.length > 0 && (
                <div className="p-4 text-center text-gray-500">
                  No cities found for the selected countries
                </div>
              )}
              {selectedCountries.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  Select countries to view their cities
                </div>
              )}
            </div>
          </div>

          {/* Update Button */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSaveMapping}
              disabled={loading || Object.keys(selectedCities).length === 0}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsManagement; 