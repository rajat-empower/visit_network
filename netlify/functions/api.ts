import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import { LocationsController } from '../../api/src/controllers/locations.controller';

// Initialize express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize controller
const locationsController = new LocationsController();

// API Routes - removed /api prefix since it's already handled by Netlify redirect
app.get('/v1/locations/countries', locationsController.getCountries);
app.get('/v1/locations/cities', locationsController.getCities);
app.get('/v1/locations/mappings', locationsController.getMappings);
app.post('/v1/locations/mapping', locationsController.updateMapping);
app.get('/v1/locations/cities/:cityId', locationsController.getCityDetails);
app.put('/v1/locations/cities/:cityId', locationsController.updateCityDetails);
app.post('/v1/locations/cities/:cityId/regenerate-image', locationsController.regenerateCityImage);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Export handler
export const handler = serverless(app);