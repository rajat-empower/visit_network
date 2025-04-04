import express from 'express';
import cors from 'cors';
import locationsRoutes from './routes/locations';
import toursRoutes from './routes/tours.routes';
import citiesRoutes from './routes/cities.routes';
//import destinationsRoutes from './routes/destinations.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Routes - remove v1 from here since it's in the frontend URL construction
app.use('/api/v1/locations', locationsRoutes);
app.use('/api/v1/tours', toursRoutes);
app.use('/api/v1/cities', citiesRoutes);
//app.use('/api/destinations', destinationsRoutes);

// Debug 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.url} not found`);
  res.status(404).json({ 
    status: 'error',
    message: `Route ${req.method} ${req.url} not found` 
  });
});

export default app; 