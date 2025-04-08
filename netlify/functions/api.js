const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

const locationsRoutes = require('../../api/src/routes/locations.routes.ts');
const citiesRoutes = require('../../api/src/routes/cities.routes.ts');
const toursRoutes = require('../../api/src/routes/tours.routes.ts');

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

// Export handler
module.exports.handler = serverless(app);
