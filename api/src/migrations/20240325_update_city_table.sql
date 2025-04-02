-- Add new columns from Viator API
ALTER TABLE cities
    ADD COLUMN IF NOT EXISTS destination_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS destination_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS destination_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS parent_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS time_zone VARCHAR(100),
    ADD COLUMN IF NOT EXISTS iata_code VARCHAR(10),
    ADD COLUMN IF NOT EXISTS sort_order INTEGER,
    ADD COLUMN IF NOT EXISTS lookup_id VARCHAR(50),
    ADD COLUMN IF NOT EXISTS viator_id VARCHAR(50);

-- Create index on destination_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_cities_destination_id ON cities(destination_id);

-- Create index on parent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_cities_parent_id ON cities(parent_id);

-- Create index on viator_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_cities_viator_id ON cities(viator_id); 