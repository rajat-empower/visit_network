"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cities_controller_1 = require("../controllers/cities.controller");
const router = (0, express_1.Router)();
const citiesController = new cities_controller_1.CitiesController();
// Debug middleware for cities routes
router.use((req, res, next) => {
    console.log(`Cities route hit: ${req.method} ${req.baseUrl}${req.url}`);
    next();
});
router.get('/', citiesController.getCities);
router.get('/:name', citiesController.getCityByName);
exports.default = router;
