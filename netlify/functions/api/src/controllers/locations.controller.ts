import { Request, Response } from 'express';
import { LocationsDAO } from '../dao/locations.dao';
//import { CityData } from '../dao/city.dao';
import { CityDAO, CityData } from '../dao/city.dao';
import { successResponse, errorResponse } from '../utils/api-response';
import viatorAPI from '../integrations/viator';
import { ninjaAPI } from '../integrations/ninja.api';
import { ViatorDestination } from '../types/viator';
import OpenAI from 'openai';
import axios from 'axios';
import path from 'path';
import { supabase } from '../config/supabase';

const BUNNY_STORAGE_ZONE = process.env.BUNNY_STORAGE_ZONE || 'visitslovenia';
const BUNNY_API_KEY = process.env.BUNNY_API_KEY;
const BUNNY_BASE_URL = `https://storage.bunnycdn.com/${BUNNY_STORAGE_ZONE}`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class LocationsController {
  private locationsDAO: LocationsDAO;
  private cityDAO: CityDAO;

  constructor() {
    this.locationsDAO = new LocationsDAO();
    this.cityDAO = new CityDAO();
  }

  getCountries = async (req: Request, res: Response) => {
    try {
      const countriesResponse = await viatorAPI.getCountries();
     
      const formattedCountries = countriesResponse.items.map((country: ViatorDestination) => ({
        id: country.destinationId,
        name: country.destinationName,
        region: country.destinationName, // For backward compatibility
        destinationId: country.destinationId,
        destinationName: country.destinationName,
        destinationType: country.destinationType,
        parentId: country.parentId,
        timeZone: country.timeZone,
        iataCode: country.iataCode,
        coordinates: country.coordinates,
        sortOrder: country.sortOrder
      }));

      return res.status(200).json(
        successResponse(
          {
            items: formattedCountries,
            totalCount: countriesResponse.totalCount,
            currentPage: countriesResponse.currentPage,
            totalPages: countriesResponse.totalPages,
            hasMore: countriesResponse.hasMore
          },
          'Countries fetched successfully',
          200
        )
      );
    } catch (error) {
      console.error('Error fetching countries:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to fetch countries',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  getCities = async (req: Request, res: Response) => {
    try {
      const parentId = req.query.parentId as string;
      
      if (!parentId) {
        return res.status(400).json(
          errorResponse(
            'ParentId parameter is required',
            400
          )
        );
      }

      const countryIds = parentId.split(',').map(id => id.trim()).filter(Boolean);
      console.log('Fetching cities for countries:', countryIds);

      const citiesResponse = await viatorAPI.getCitiesByCountries(countryIds);
      console.log('Received cities from Viator:', citiesResponse.items.length);
      //console.log("citiesResponse.items---", citiesResponse.items);
      // Get existing cities data from database to include population
      const existingCities = await Promise.all(
        citiesResponse.items.map(city => 
          this.cityDAO.getCityByName(city.destinationName)
        )
      );

      // Create a map of city names to their population data
      const cityPopulationMap = new Map(
        existingCities
          .filter(city => city !== null)
          .map(city => [city.name, city.population])
      );

      const formattedCities = await Promise.all(citiesResponse.items.map(async (city: ViatorDestination) => {
        // Get population from database or fetch from Ninja API
        let population = cityPopulationMap.get(city.destinationName);
        
        if (population === undefined) {
          console.log(`Fetching population data from Ninja API for ${city.destinationName}`);
          const populationData = await ninjaAPI.getCityPopulation(city.destinationName);
          population = populationData ?? undefined;
          
          if (population !== null) {
            // Save the population data to database for future use
            const cityData: CityData = {
              name: city.destinationName,
              population: population,
              destination_id: city.destinationId,
              destination_name: city.destinationName
            };
            try {
              await this.locationsDAO.upsertCity(cityData);
              console.log(`Saved population data for ${city.destinationName}: ${population}`);
            } catch (error) {
              console.error(`Error saving population data for ${city.destinationName}:`, error);
            }
          }
        }

        return {
          id: city.destinationId,
          name: city.destinationName,
          region: city.countryName || city.parentId || 'Unknown',
          destinationId: city.destinationId,
          destinationName: city.destinationName,
          destinationType: city.destinationType,
          parentId: city.parentId,
          timeZone: city.timeZone,
          iataCode: city.iataCode,
          coordinates: city.coordinates,
          sortOrder: city.sortOrder,
          countryName: city.countryName || city.parentId || 'Unknown',
          lookupId: city.lookupId,
          population: population || undefined
        };
      }));

      console.log(`Returning ${formattedCities.length} cities with population data`);

      return res.status(200).json(
        successResponse(
          {
            items: formattedCities,
            totalCount: citiesResponse.totalCount,
            currentPage: citiesResponse.currentPage,
            totalPages: citiesResponse.totalPages,
            hasMore: citiesResponse.hasMore
          },
          'Cities fetched successfully',
          200
        )
      );
    } catch (error) {
      console.error('Error fetching cities:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to fetch cities',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  updateMapping = async (req: Request, res: Response) => {
    try {
      const { mappings } = req.body;
      console.log('Received mappings:', JSON.stringify(mappings, null, 2));

      if (!mappings || typeof mappings !== 'object') {
        return res.status(400).json(
          errorResponse(
            'Please provide valid country and city mappings',
            400
          )
        );
      }

      // Delete existing mappings
      await this.locationsDAO.deleteAllMappings();
      console.log('Deleted existing mappings');

      // Get all unique cityIds
      const allCityIds = [...new Set(
        Object.values(mappings).flat()
      )];
      console.log('Unique city IDs to process:', allCityIds);

      if (allCityIds.length === 0) {
        return res.status(200).json(
          successResponse(
            null,
            'All location mappings have been cleared successfully',
            200
          )
        );
      }

      // Fetch selected cities data from Viator
      console.log('Fetching cities data from Viator for countries:', Object.keys(mappings));
      const selectedCitiesResponse = await viatorAPI.getCitiesByCountries(Object.keys(mappings));
      console.log('Received cities from Viator:', selectedCitiesResponse.items.length);

      // Create a map of all cities from Viator response
      const selectedCitiesMap = new Map(
        selectedCitiesResponse.items.map(city => [city.destinationId, city])
      );
      console.log('Created cities map with keys:', Array.from(selectedCitiesMap.keys()));

      // Prepare selected cities for saving
      const citiesToSave: CityData[] = [];
      const skippedCities: string[] = [];
      
      // Process each selected city ID
      for (const cityId of allCityIds) {
        const city = selectedCitiesResponse.items.find(
          c => String(c.destinationId) === String(cityId)
        );

        if (city) {
          console.log(`Found matching city for ID ${cityId}: ${city.destinationName}`);
          
          try {
            // Check if city already exists
            //const existingCity = await this.locationsDAO.getCityById(city.destinationId);
            const existingCity = await this.locationsDAO.getCityByName(city.destinationName);
            
            if (existingCity) {
              console.log(`City ${city.destinationName} exists, updating destination info...`);
              try {
                if (existingCity?.id) {
                  await this.locationsDAO.updateCity(existingCity.id, {
                    destination_id: city.destinationId,
                    destination_name: city.destinationName,
                    destination_type: city.destinationType,
                    parent_id: city.parentId || undefined
                  });
                  console.log(`Successfully updated destination info for city: ${city.destinationName}`);
                }
              } catch (error) {
                console.error(`Error updating destination info for city ${city.destinationName}:`, error);
                skippedCities.push(city.destinationName);
              }
              continue;
            }

            // Fetch population data from Ninja API
            console.log(`Fetching population data for ${city.destinationName}`);
            const population = await ninjaAPI.getCityPopulation(city.destinationName);
            //console.log("population---", population);
            const cityData: CityData = {
              name: city.destinationName,
              description: '', // Can be updated later with more detailed info
              latitude: city.coordinates?.latitude,
              longitude: city.coordinates?.longitude,
              type: city.destinationType,
              region: city.countryName || city.parentId || 'Unknown',
              viator_id: city.destinationId,
              active: true,
              destination_id: city.destinationId,
              destination_name: city.destinationName,
              destination_type: city.destinationType,
              parent_id: city.parentId || undefined,
              time_zone: city.timeZone,
              iata_code: city.iataCode,
              sort_order: city.sortOrder,
              lookup_id: city.lookupId,
              population: population || undefined // Add population data if available
            };
            console.log(`Preparing data for city ${city.destinationName}:`, JSON.stringify(cityData, null, 2));
            citiesToSave.push(cityData);
          } catch (error) {
            console.error(`Error checking existing city ${city.destinationName}:`, error);
            // Continue with next city if there's an error checking this one
            continue;
          }
        } else {
          console.log(`Warning: No matching city found for ID ${cityId}`);
        }
      }

      // Save new cities to database
      if (citiesToSave.length > 0) {
        console.log(`Saving ${citiesToSave.length} new cities to database...`);
        try {
          for (const cityData of citiesToSave) {
            try {
              console.log("cityData---", cityData);
              await this.locationsDAO.upsertCity(cityData);
              console.log(`Successfully saved city: ${cityData.name} with population: ${cityData.population || 'N/A'}`);
            } catch (error) {
              console.error(`Error saving city ${cityData.name}:`, error);
              skippedCities.push(cityData.name);
            }
          }
          console.log('Finished processing all cities');
        } catch (error) {
          console.error('Error during city save process:', error);
        }
      } else {
        console.log('No new cities to save in database');
      }

      if (skippedCities.length > 0) {
        console.log('Skipped existing cities:', skippedCities);
      }

      // Create new mappings
      console.log('Creating location mappings...');
      const allMappings = Object.entries(mappings).flatMap(([countryId, cityIds]: [string, unknown]) =>
        (cityIds as number[]).map((cityId: number) => ({
          country_id: parseInt(countryId),
          city_id: cityId,
          created_by: 'system',
          updated_by: 'system',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }))
      );

      console.log('Created mappings:', JSON.stringify(allMappings, null, 2));
      const savedMappings = await this.locationsDAO.createMappings(allMappings);
      console.log('Mappings saved successfully');

      // Count countries and cities for the success message
      const countryCount = Object.keys(mappings).length;
      const cityCount = allCityIds.length;
      const newCityCount = citiesToSave.length - skippedCities.length;

      return res.status(200).json(
        successResponse(
          savedMappings,
          `Successfully updated ${cityCount} ${cityCount === 1 ? 'city' : 'cities'} in ${countryCount} ${countryCount === 1 ? 'country' : 'countries'} (${newCityCount} new cities added, ${skippedCities.length} existing cities skipped)`,
          200
        )
      );
    } catch (error) {
      console.error('Error updating city mapping:', error);
      return res.status(500).json(
        errorResponse(
          error instanceof Error ? error.message : 'Failed to update location mappings',
          500
        )
      );
    }
  };

  getMappings = async (req: Request, res: Response) => {
    try {
      const mappings = await this.locationsDAO.getAllMappings();

      // Transform the data into a more usable format
      const countryMappings: { [key: string]: string[] } = {};

      // Group cities by country
      mappings?.forEach(mapping => {
        if (!countryMappings[mapping.country_id]) {
          countryMappings[mapping.country_id] = [];
        }
        countryMappings[mapping.country_id].push(mapping.city_id);
      });

      return res.status(200).json(
        successResponse(
          { countryMappings },
          'Location Mappings fetched successfully',
          200
        )
      );
    } catch (error) {
      console.error('Error fetching mappings:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to fetch Location mappings',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  private async uploadImageToBunnyCDN(imageUrl: string, folder: string = '/uploads/cities'): Promise<string> {
    try {
      const timestamp = Date.now();
      const extension = '.png';
      const fileName = `${timestamp}${extension}`;
      const bunnyUploadUrl = `${BUNNY_BASE_URL}${folder}/${fileName}`;

      // Download image from source
      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(imageResponse.data, 'binary');

      // Upload to BunnyCDN
      await axios.put(bunnyUploadUrl, imageBuffer, {
        headers: {
          'AccessKey': BUNNY_API_KEY,
          'Content-Type': 'application/octet-stream',
        },
      });

      return `https://${BUNNY_STORAGE_ZONE}.b-cdn.net${folder}/${fileName}`;
    } catch (error) {
      console.error('Error uploading image to BunnyCDN:', error);
      throw new Error('Failed to upload image to BunnyCDN');
    }
  }

  private async generateCityImage(cityName: string, countryName: string): Promise<string> {
    try {
      const prompt = `Create a landscape image of ${cityName}, ${countryName}. Show the city's iconic landmarks and natural beauty in a high-quality, professional travel photography style.`;
      
      const response = await openai.images.generate({
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "url",
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) throw new Error('No image generated');

      // Upload to BunnyCDN
      const cdnUrl = await this.uploadImageToBunnyCDN(imageUrl);
      return cdnUrl;
    } catch (error) {
      console.error('Error generating city image:', error);
      throw new Error('Failed to generate city image');
    }
  }

  getCityDetails = async (req: Request, res: Response) => {
    try {
      const { cityId } = req.params;

      if (!cityId) {
        return res.status(400).json(
          errorResponse('City ID is required', 400)
        );
      }

      const cityDetails = await this.locationsDAO.getCityById(cityId);
      
      if (!cityDetails) {
        return res.status(404).json(
          errorResponse('City not found', 404)
        );
      }

      return res.status(200).json(
        successResponse(
          cityDetails,
          'City details fetched successfully',
          200
        )
      );
    } catch (error) {
      console.error('Error fetching city details:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to fetch city details',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  updateCityDetails = async (req: Request, res: Response) => {
    try {
      const { cityId } = req.params;
      const updateData = req.body;

      if (!cityId) {
        return res.status(400).json(
          errorResponse('City ID is required', 400)
        );
      }

      // Remove any null or undefined values
      const cleanedData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v != null && v !== '')
      );

      const existingCity = await this.locationsDAO.getCityById(cityId);
      if (!existingCity) {
        return res.status(404).json(
          errorResponse('City not found', 404)
        );
      }

      const updatedCity = await this.locationsDAO.updateCityDetails(cityId, cleanedData);

      return res.status(200).json(
        successResponse(
          updatedCity,
          'City details updated successfully',
          200
        )
      );
    } catch (error) {
      console.error('Error updating city details:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to update city details',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  regenerateCityImage = async (req: Request, res: Response) => {
    try {
      const { cityId } = req.params;

      if (!cityId) {
        return res.status(400).json(
          errorResponse('City ID is required', 400)
        );
      }

      const city = await this.locationsDAO.getCityById(cityId);
      if (!city) {
        return res.status(404).json(
          errorResponse('City not found', 404)
        );
      }

      if (!city.name || !city.region) {
        return res.status(400).json(
          errorResponse('City name and region are required', 400)
        );
      }

      // Generate new image
      const newImageUrl = await this.generateCityImage(city.name, city.region);

      // Update city with new image URL
      const updatedCity = await this.locationsDAO.updateCityDetails(cityId, {
        image_url: newImageUrl
      });

      return res.status(200).json(
        successResponse(
          updatedCity,
          'City image regenerated successfully',
          200
        )
      );
    } catch (error) {
      console.error('Error regenerating city image:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to regenerate city image',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };

  async getCityByName(name: string) {
    console.log('Checking if city exists:', name);
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('name', name)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking city existence:', error);
      throw error;
    }

    return data;
  }

  async updateCity(id: string, updateData: Partial<CityData>) {
    if (!id) {
      throw new Error('City ID is required');
    }

    const { data, error } = await supabase
      .from('cities')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating city:', error);
      throw error;
    }

    return data;
  }
} 