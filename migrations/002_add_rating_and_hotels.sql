-- Add rating column to tours table
ALTER TABLE tours ADD COLUMN rating numeric(2,1);

-- Create hotels table
CREATE TABLE hotels (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    image_url text,
    rating numeric(2,1),
    city_id uuid REFERENCES cities(id),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
