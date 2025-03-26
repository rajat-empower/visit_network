import { Router } from 'express';
import serverless from 'serverless-http';
import express from 'express';
import { LocationsController } from '../../api/src/controllers/locations.controller';

const api = express();
const router = Router();
const locationsController = new LocationsController();

// Middleware
api.use(cors());
api.use(express.json());

// Routes
router.get('/countries', locationsController.getCountries);
router.get('/cities', locationsController.getCities);
router.post('/mapping', locationsController.updateMapping);
router.get('/mappings', locationsController.getMappings);

// Base path for API routes
api.use('/api/v1/locations', router);

// Handle 404
api.use((_req: express.Request, res: express.Response) => {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: 'Route not found'
  });
});

// Export handler for serverless function
export const handler = serverless(api); 

function cors(): any {
    throw new Error('Function not implemented.');
}
