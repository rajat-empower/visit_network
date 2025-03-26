-- Add new fields to the articles table
ALTER TABLE articles
ADD COLUMN author TEXT,
ADD COLUMN tags TEXT,
ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Rename featured_image_url to feature_img for consistency with the component
ALTER TABLE articles 
RENAME COLUMN featured_image_url TO feature_img;
