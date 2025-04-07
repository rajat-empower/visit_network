"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitiesController = void 0;
const city_dao_1 = require("../dao/city.dao");
const api_response_1 = require("../utils/api-response");
class CitiesController {
    constructor() {
        this.getCities = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const cities = yield this.cityDAO.getAllCities();
                // Format the response to match the frontend's expected structure
                const formattedCities = cities.map(city => ({
                    id: city.destination_id || city.id,
                    name: city.name,
                    description: city.description || '',
                    image_url: city.image_url || '/images/placeholder-city.jpg', // Add a default image
                    popularity: null // Can be updated later with actual popularity data
                }));
                return res.status(200).json((0, api_response_1.successResponse)({ cities: formattedCities }, 'Cities fetched successfully', 200));
            }
            catch (error) {
                console.error('Error fetching cities:', error);
                return res.status(500).json((0, api_response_1.errorResponse)('Failed to fetch cities', 500, error instanceof Error ? error.message : 'Unknown error'));
            }
        });
        this.getCityByName = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.params;
                const city = yield this.cityDAO.getCityByName(name);
                if (!city) {
                    return res.status(404).json((0, api_response_1.errorResponse)('City not found', 404));
                }
                // Format the response to match the frontend's expected structure
                const formattedCity = {
                    id: city.destination_id || city.id,
                    name: city.name,
                    description: city.description || '',
                    image_url: city.image_url || '/images/placeholder-city.jpg',
                    popularity: null,
                    population: city.population,
                    coordinates: {
                        latitude: city.latitude,
                        longitude: city.longitude
                    }
                };
                return res.status(200).json((0, api_response_1.successResponse)({ city: formattedCity }, 'City fetched successfully', 200));
            }
            catch (error) {
                console.error('Error fetching city:', error);
                return res.status(500).json((0, api_response_1.errorResponse)('Failed to fetch city', 500, error instanceof Error ? error.message : 'Unknown error'));
            }
        });
        this.cityDAO = new city_dao_1.CityDAO();
    }
}
exports.CitiesController = CitiesController;
