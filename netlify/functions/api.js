import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';

import locationsRoutes from '../../api/src/routes/locations.js';
import citiesRoutes from '../../api/src/routes/cities.routes.js';
import toursRoutes from '../../api/src/routes/tours.routes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/v1/locations', locationsRoutes);
app.use('/v1/cities', citiesRoutes);
app.use('/v1/tours', toursRoutes);


app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// 👇 this export is critical
export const handler = serverless(app);
