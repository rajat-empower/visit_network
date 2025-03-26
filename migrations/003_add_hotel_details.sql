-- Add additional fields to hotels table
ALTER TABLE hotels
ADD COLUMN location text,
ADD COLUMN images text[],
ADD COLUMN facilities text[],
ADD COLUMN latitude double precision,
ADD COLUMN longitude double precision,
ADD COLUMN nearby_attractions jsonb,
ADD COLUMN nearby_restaurants jsonb,
ADD COLUMN transportation_options jsonb;
