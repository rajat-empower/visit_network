import { Router } from 'express';
import { LocationsController } from '../controllers/locations.controller';

const router = Router();
const locationsController = new LocationsController();

// Get all countries
router.get('/countries', locationsController.getCountries);

// Get cities by countries
router.get('/cities', locationsController.getCities);

// Save country-city mapping
router.post('/mapping', locationsController.updateMapping);

// Get existing mappings
router.get('/mappings', locationsController.getMappings);

// New routes for city details
router.get('/cities/:cityId', locationsController.getCityDetails);
router.put('/cities/:cityId', locationsController.updateCityDetails);
router.post('/cities/:cityId/regenerate-image', locationsController.regenerateCityImage);

export default router; 



