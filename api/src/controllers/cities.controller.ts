import { Request, Response } from 'express';
import { CityDAO } from '../dao/city.dao';
import { successResponse, errorResponse } from '../utils/api-response';

export class CitiesController {
  private cityDAO: CityDAO;

  constructor() {
    this.cityDAO = new CityDAO();
  }

  getCities = async (req: Request, res: Response) => {
    try {
      const cities = await this.cityDAO.getAllCities();
      
      // Format the response to match the frontend's expected structure
      const formattedCities = cities.map(city => ({
        id: city.destination_id || city.id,
        name: city.name,
        description: city.description || '',
        image_url: city.image_url || '/images/placeholder-city.jpg', // Add a default image
        popularity: null // Can be updated later with actual popularity data
      }));

      return res.status(200).json(
        successResponse(
          { cities: formattedCities },
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

  getCityByName = async (req: Request, res: Response) => {
    try {
      const { name } = req.params;
      const city = await this.cityDAO.getCityByName(name);

      if (!city) {
        return res.status(404).json(
          errorResponse(
            'City not found',
            404
          )
        );
      }

      // Format the response to match the frontend's expected structure
      const formattedCity = {
        id: city.destination_id || city.id,
        name: city.name,
        description: city.description || '',
        image_url: city.image_url || '/images/placeholder-city.jpg',
        popularity: null,
        population: city.population,
        coordinates: {
          latitude: city.latitude,
          longitude: city.longitude
        }
      };

      return res.status(200).json(
        successResponse(
          { city: formattedCity },
          'City fetched successfully',
          200
        )
      );
    } catch (error) {
      console.error('Error fetching city:', error);
      return res.status(500).json(
        errorResponse(
          'Failed to fetch city',
          500,
          error instanceof Error ? error.message : 'Unknown error'
        )
      );
    }
  };
} 