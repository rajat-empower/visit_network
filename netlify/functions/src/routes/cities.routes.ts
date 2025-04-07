import { Router } from 'express';
import { CitiesController } from '../controllers/cities.controller';

const router = Router();
const citiesController = new CitiesController();

// Debug middleware for cities routes
router.use((req, res, next) => {
  console.log(`Cities route hit: ${req.method} ${req.baseUrl}${req.url}`);
  next();
});

router.get('/', citiesController.getCities);
router.get('/:name', citiesController.getCityByName);

export default router; 