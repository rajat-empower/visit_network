import express, { Router } from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import locationsRoutes from '../../api/src/routes/locations';
import citiesRoutes from '../../api/src/routes/cities.routes';
import toursRoutes from '../../api/src/routes/tours.routes';

// Initialize express
const app = express();
const router = Router();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/v1/locations', locationsRoutes);
app.use('/api/v1/cities', citiesRoutes);
app.use('/api/v1/tours', toursRoutes);


// Export handler for serverless
export const handler = serverless(app); 