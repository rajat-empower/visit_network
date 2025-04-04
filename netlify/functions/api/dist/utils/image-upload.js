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
exports.uploadImageToCDN = uploadImageToCDN;
const axios_1 = __importDefault(require("axios"));
const supabase_1 = require("../config/supabase");
function uploadImageToCDN(imageUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Download image from URL
            const response = yield axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            // Generate unique filename
            const filename = `tour-images/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
            // Upload to Supabase Storage
            const { data, error } = yield supabase_1.supabase.storage
                .from('public')
                .upload(filename, buffer, {
                contentType: response.headers['content-type'],
                cacheControl: '3600'
            });
            if (error) {
                throw error;
            }
            // Get public URL
            const { data: { publicUrl } } = supabase_1.supabase.storage
                .from('public')
                .getPublicUrl(filename);
            return publicUrl;
        }
        catch (error) {
            console.error('Error uploading image to CDN:', error);
            throw error;
        }
    });
}
