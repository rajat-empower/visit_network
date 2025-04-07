"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const locations_1 = __importDefault(require("./routes/locations"));
const tours_routes_1 = __importDefault(require("./routes/tours.routes"));
const cities_routes_1 = __importDefault(require("./routes/cities.routes"));
//import destinationsRoutes from './routes/destinations.routes';
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
// Routes - remove v1 from here since it's in the frontend URL construction
app.use('/api/v1/locations', locations_1.default);
app.use('/api/v1/tours', tours_routes_1.default);
app.use('/api/v1/cities', cities_routes_1.default);
//app.use('/api/destinations', destinationsRoutes);
// Debug 404 handler
app.use((req, res) => {
    console.log(`404: ${req.method} ${req.url} not found`);
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.url} not found`
    });
});
exports.default = app;
