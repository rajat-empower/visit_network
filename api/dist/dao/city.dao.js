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
exports.CityDAO = void 0;
const supabase_1 = require("../config/supabase");
class CityDAO {
    getAllCities() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fetching all cities');
            const { data, error } = yield supabase_1.supabase
                .from('cities')
                .select('*')
                .order('name');
            if (error) {
                console.error('Error fetching cities:', error);
                throw error;
            }
            return data || [];
        });
    }
    upsertCity(city) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Upserting city:', city);
            const { data, error } = yield supabase_1.supabase
                .from('cities')
                .upsert([city])
                .select();
            if (error) {
                console.error('Error upserting city:', error);
                throw error;
            }
            return data;
        });
    }
    upsertCities(cities) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Upserting cities:', cities);
            const { data, error } = yield supabase_1.supabase
                .from('cities')
                .upsert(cities)
                .select();
            if (error) {
                console.error('Error upserting cities:', error);
                throw error;
            }
            return data;
        });
    }
    getCityByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Checking if city exists:', name);
            const { data, error } = yield supabase_1.supabase
                .from('cities')
                .select('*')
                .eq('name', name)
                .single();
            if (error && error.code !== 'PGRST116') { // PGRST116 is the "no rows returned" error
                console.error('Error checking city existence:', error);
                throw error;
            }
            return data;
        });
    }
    getCityByViatorId(viatorId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fetching city by viator_id:', viatorId);
            const { data, error } = yield supabase_1.supabase
                .from('cities')
                .select('*')
                .eq('viator_id', viatorId)
                .single();
            if (error)
                throw error;
            console.log('City fetch result:', JSON.stringify(data, null, 2));
            return data;
        });
    }
    getCityByDestinationId(destinationId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Fetching city by destination_id:', destinationId);
            const { data, error } = yield supabase_1.supabase
                .from('cities')
                .select('*')
                .eq('destination_id', destinationId)
                .single();
            if (error)
                throw error;
            console.log('City fetch result:', JSON.stringify(data, null, 2));
            return data;
        });
    }
    updateCity(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Updating city with ID:', id, 'Data:', updateData);
            const { data, error } = yield supabase_1.supabase
                .from('cities')
                .update(updateData)
                .eq('id', id)
                .select();
            if (error) {
                console.error('Error updating city:', error);
                throw error;
            }
            return data;
        });
    }
}
exports.CityDAO = CityDAO;
