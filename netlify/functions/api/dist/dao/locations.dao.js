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
exports.LocationsDAO = void 0;
const supabase_1 = require("../config/supabase");
const logger_1 = require("../utils/logger");
class LocationsDAO {
    deleteAllMappings() {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = yield supabase_1.supabase
                .from('locations_mapping')
                .delete()
                .gt('id', 0);
            if (error)
                throw error;
        });
    }
    createMappings(mappings) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data, error } = yield supabase_1.supabase
                .from('locations_mapping')
                .insert(mappings.map(mapping => (Object.assign(Object.assign({}, mapping), { created_by: 'system', updated_by: 'system' }))))
                .select();
            if (error)
                throw error;
            return data;
        });
    }
    getMappedCities() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase_1.supabase
                    .from('cities')
                    .select(`
          id,
          name,
          destination_id,
          parent_id,
          time_zone
        `);
                if (error)
                    throw error;
                return data.map(city => ({
                    id: city.id,
                    name: city.name,
                    destinationId: city.destination_id,
                    countryId: city.parent_id,
                    regionId: city.time_zone
                }));
            }
            catch (error) {
                logger_1.logger.error('Failed to get mapped cities:', error);
                throw error;
            }
        });
    }
    getAllMappings() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, error } = yield supabase_1.supabase
                    .from('locations_mapping')
                    .select('*');
                if (error)
                    throw error;
                return data;
            }
            catch (error) {
                logger_1.logger.error('Failed to get all mappings:', error);
                throw error;
            }
        });
    }
}
exports.LocationsDAO = LocationsDAO;
