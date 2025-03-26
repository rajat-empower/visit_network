import express from 'express';
import { LocationsController } from '../controllers/locations.controller';

const router = express.Router();
const locationsController = new LocationsController();

// Get all countries
router.get('/countries', locationsController.getCountries);

// Get cities by countries
router.get('/cities', locationsController.getCities);

// Save country-city mapping
router.post('/mapping', locationsController.updateMapping);

// Get existing mappings
router.get('/mappings', locationsController.getMappings);

export default router; 