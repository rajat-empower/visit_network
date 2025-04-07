-- Create city table
CREATE TABLE IF NOT EXISTS city (
    id SERIAL PRIMARY KEY,
    destination_id VARCHAR(50) UNIQUE NOT NULL,
    destination_name VARCHAR(255) NOT NULL,
    destination_type VARCHAR(50),
    parent_id VARCHAR(50),
    time_zone VARCHAR(100),
    iata_code VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    sort_order INTEGER,
    country_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100) DEFAULT 'system',
    updated_by VARCHAR(100) DEFAULT 'system'
);

-- Create index on destination_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_city_destination_id ON city(destination_id);

-- Create index on parent_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_city_parent_id ON city(parent_id); 