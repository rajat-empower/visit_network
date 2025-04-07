import { Router } from 'express';
import { ToursController } from '../controllers/tours.controller';

const router = Router();
const toursController = new ToursController();

console.log('Registering tours routes...');

// Debug middleware for tours routes
router.use((req, res, next) => {
  console.log(`Tours route hit: ${req.method} ${req.baseUrl}${req.url}`);
  next();
});

// Tour import endpoints
router.post('/verify', toursController.verifyLocations.bind(toursController));
router.post('/preview', toursController.previewTours.bind(toursController));
router.post('/import', toursController.importTour.bind(toursController));
router.post('/reset', toursController.resetTours.bind(toursController));
router.post('/create', toursController.createTour.bind(toursController));
router.get('/imported-data', toursController.getImportedData);

console.log('Tours routes registered');

export default router; 