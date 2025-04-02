"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const locations_controller_1 = require("../controllers/locations.controller");
const router = express_1.default.Router();
const locationsController = new locations_controller_1.LocationsController();
// Get all countries
router.get('/countries', locationsController.getCountries);
// Get cities by countries
router.get('/cities', locationsController.getCities);
// Save country-city mapping
router.post('/mapping', locationsController.updateMapping);
// Get existing mappings
router.get('/mappings', locationsController.getMappings);
exports.default = router;
