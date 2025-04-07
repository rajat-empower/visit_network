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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ninjaAPI = void 0;
const axios_1 = __importDefault(require("axios"));
class NinjaAPI {
    constructor() {
        this.baseURL = 'https://api.api-ninjas.com/v1';
        this.apiKey = process.env.NINJA_API_KEY || '';
        if (!this.apiKey) {
            console.warn('NINJA_API_KEY not found in environment variables');
        }
    }
    getCityPopulation(cityName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Fetching population for city:', cityName);
                const response = yield axios_1.default.get(`${this.baseURL}/city?name=${encodeURIComponent(cityName)}`, {
                    headers: {
                        'X-Api-Key': this.apiKey
                    }
                });
                console.log('Ninja API Response for', cityName, ':', JSON.stringify(response.data, null, 2));
                if (response.data && response.data.length > 0) {
                    const population = response.data[0].population;
                    console.log(`Population found for ${cityName}: ${population.toLocaleString()} inhabitants`);
                    return population;
                }
                console.log(`No population data found for ${cityName}`);
                return null;
            }
            catch (error) {
                console.error(`Error fetching population for ${cityName}:`, error);
                return null;
            }
        });
    }
}
exports.ninjaAPI = new NinjaAPI();
