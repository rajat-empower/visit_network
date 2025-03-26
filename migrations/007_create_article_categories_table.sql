-- Create article_categories table
CREATE TABLE article_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Add category_id to article table
ALTER TABLE article
ADD COLUMN category_id INTEGER REFERENCES article_categories(id);

-- Insert sample categories
INSERT INTO article_categories (name, slug, description) VALUES
('Culture and Heritage', 'culture-and-heritage', 'Explore Slovenia''s rich cultural heritage and traditions'),
('Editor''s Picks', 'editors-picks', 'Our editors'' favorite articles about Slovenia'),
('Events and Festivals', 'events-and-festivals', 'Discover Slovenia''s vibrant events and festivals'),
('Explore Gorenjska', 'explore-gorenjska', 'Guide to exploring the Gorenjska region of Slovenia'),
('Explore Primorsko-Notranjska', 'explore-primorsko-notranjska', 'Discover the Primorsko-Notranjska region'),
('Historical Sites', 'historical-sites', 'Explore Slovenia''s fascinating historical sites'),
('Ljubljana and Central Slovenia', 'ljubljana-and-central-slovenia', 'Guide to Ljubljana and Central Slovenia'),
('Outdoor Adventures', 'outdoor-adventures', 'Outdoor activities and adventures in Slovenia'),
('Pomurska', 'pomurska', 'Discover the Pomurska region of Slovenia'),
('Slovenian Coast and Karst', 'slovenian-coast-and-karst', 'Explore Slovenia''s beautiful coastline and Karst region');

-- Update existing articles with categories
UPDATE article SET category_id = 2 WHERE id = 1; -- Exploring the Hidden Gems of Slovenia -> Editor's Picks
UPDATE article SET category_id = 2 WHERE id = 2; -- Slovenia Visa and Entry Requirements -> Editor's Picks
