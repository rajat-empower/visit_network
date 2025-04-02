-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id SERIAL PRIMARY KEY,
  viator_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  currency VARCHAR(3),
  duration VARCHAR(100),
  image_urls TEXT[],
  booking_link TEXT,
  city_id VARCHAR(255),
  tour_type_id VARCHAR(255),
  is_featured BOOLEAN DEFAULT false,
  rating DECIMAL(3,2),
  included TEXT[],
  policy TEXT,
  additional TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on viator_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_tours_viator_id ON tours(viator_id);

-- Create index on city_id for faster joins
CREATE INDEX IF NOT EXISTS idx_tours_city_id ON tours(city_id);

-- Create index on tour_type_id for faster joins
CREATE INDEX IF NOT EXISTS idx_tours_tour_type_id ON tours(tour_type_id); 