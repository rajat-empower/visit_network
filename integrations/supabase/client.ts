
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';


import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Use environment variables for Supabase credentials
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;



// This client should only be used for client-side operations that don't require admin privileges
// For admin operations, use the server-side API routes
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
