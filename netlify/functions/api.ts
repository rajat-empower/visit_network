import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import locationsRoutes from '../../api/src/routes/locations'; // Correct path
import citiesRoutes from '../../api/src/routes/cities.routes';
import toursRoutes from '../../api/src/routes/tours.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use('/api/v1/locations', locationsRoutes);  // This is where /api/v1/locations routes are registered
app.use('/api/v1/cities', citiesRoutes);
app.use('/api/v1/tours', toursRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Export handler for serverless
export const handler = serverless(app);
