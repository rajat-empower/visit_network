-- Sites table - stores information about each travel site
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  primary_color TEXT DEFAULT '#3B82F6',
  secondary_color TEXT DEFAULT '#1E3A8A',
  primary_font TEXT DEFAULT 'Inter',
  secondary_font TEXT DEFAULT 'Merriweather',
  logo_url TEXT,
  favicon_url TEXT,
  location_type TEXT NOT NULL CHECK (location_type IN ('country', 'city', 'region')),
  location_name TEXT NOT NULL,
  latitude FLOAT,
  longitude FLOAT,
  openweather_city_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Social media links for sites
CREATE TABLE site_social_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'youtube', 'pinterest', 'tiktok')),
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menus for sites
CREATE TABLE site_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('header', 'footer', 'sidebar')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES site_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES menu_items(id),
  title TEXT NOT NULL,
  url TEXT,
  page_id UUID,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories for content organization
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  featured_image_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('blog', 'accommodation', 'tour')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, slug, type)
);

-- Tags for content
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

-- Accommodations (imported from RateHawk API)
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  external_id TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  address TEXT,
  city TEXT NOT NULL,
  region TEXT,
  country TEXT NOT NULL,
  postal_code TEXT,
  latitude FLOAT,
  longitude FLOAT,
  star_rating FLOAT,
  accommodation_type TEXT CHECK (accommodation_type IN ('hotel', 'apartment', 'hostel', 'bed_and_breakfast', 'villa', 'resort', 'other')),
  zen_hotels_url TEXT,
  booking_com_url TEXT,
  hotels_com_url TEXT,
  expedia_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  total_rooms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

-- Accommodation images
CREATE TABLE accommodation_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accommodation amenities
CREATE TABLE amenities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  icon TEXT,
  category TEXT CHECK (category IN ('general', 'room', 'bathroom', 'entertainment', 'food', 'services', 'accessibility')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Association table for accommodations and amenities
CREATE TABLE accommodation_amenities (
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  amenity_id UUID NOT NULL REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (accommodation_id, amenity_id)
);

-- Room types for accommodations
CREATE TABLE room_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  max_occupancy INTEGER,
  bed_type TEXT,
  room_size FLOAT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accommodation reviews (could be imported or AI-generated)
CREATE TABLE accommodation_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  author_name TEXT,
  rating FLOAT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_source TEXT CHECK (review_source IN ('zenhotels', 'booking', 'tripadvisor', 'google', 'generated', 'custom')),
  review_date DATE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attractions near accommodations
CREATE TABLE accommodation_attractions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accommodation_id UUID NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  distance FLOAT,
  unit TEXT CHECK (unit IN ('km', 'mi')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tours and activities (imported from Viator API)
CREATE TABLE tours (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  external_id TEXT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  duration TEXT,
  price NUMERIC,
  currency TEXT,
  viator_url TEXT,
  meeting_point TEXT,
  latitude FLOAT,
  longitude FLOAT,
  featured BOOLEAN DEFAULT FALSE,
  tour_type TEXT CHECK (tour_type IN ('walking', 'bus', 'boat', 'food', 'museum', 'day_trip', 'other')),
  group_size TEXT,
  languages TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

-- Tour images
CREATE TABLE tour_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour highlights
CREATE TABLE tour_highlights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour reviews
CREATE TABLE tour_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  author_name TEXT,
  rating FLOAT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_source TEXT CHECK (review_source IN ('viator', 'tripadvisor', 'google', 'generated', 'custom')),
  review_date DATE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image_url TEXT,
  author TEXT DEFAULT 'Travel Editor',
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  ai_generated BOOLEAN DEFAULT FALSE,
  seo_title TEXT,
  seo_description TEXT,
  canonical_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

-- Association table for articles and categories
CREATE TABLE article_categories (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- Association table for articles and tags
CREATE TABLE article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Content blocks for dynamic page sections
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('hero', 'featured_hotels', 'featured_tours', 'featured_articles', 'testimonials', 'call_to_action', 'custom')),
  content JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Static pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  template TEXT DEFAULT 'default',
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  featured_image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

-- Page content blocks association
CREATE TABLE page_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES content_blocks(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media library
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  url TEXT NOT NULL,
  cdn_url TEXT,
  alt_text TEXT,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Itineraries
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  duration INTEGER,
  featured_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_id, slug)
);

-- Itinerary days
CREATE TABLE itinerary_days (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_id UUID NOT NULL REFERENCES itineraries(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Itinerary points of interest
CREATE TABLE itinerary_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('attraction', 'accommodation', 'restaurant', 'transport', 'other')),
  order_index INTEGER NOT NULL DEFAULT 0,
  latitude FLOAT,
  longitude FLOAT,
  image_url TEXT,
  link_url TEXT,
  tour_id UUID REFERENCES tours(id),
  accommodation_id UUID REFERENCES accommodations(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO settings
CREATE TABLE seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('site', 'page', 'article', 'accommodation', 'tour', 'category')),
  entity_id UUID NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  canonical_url TEXT,
  schema_markup JSONB,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  twitter_title TEXT,
  twitter_description TEXT,
  twitter_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site analytics
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  ga_tracking_id TEXT,
  gtm_container_id TEXT,
  fb_pixel_id TEXT,
  other_scripts JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API configurations
CREATE TABLE api_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  api_name TEXT NOT NULL CHECK (api_name IN ('viator', 'ratehawk', 'openweather', 'google_maps', 'other')),
  api_key TEXT,
  api_secret TEXT,
  endpoint_url TEXT,
  config_json JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Affiliate configuration
CREATE TABLE affiliate_configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('viator', 'zenhotels', 'booking', 'hotels', 'expedia', 'other')),
  affiliate_id TEXT NOT NULL,
  tracking_parameter TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI article generation templates
CREATE TABLE ai_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  prompt_template TEXT NOT NULL,
  llm_provider TEXT NOT NULL CHECK (llm_provider IN ('openai', 'anthropic', 'deepseek', 'other')),
  model_name TEXT NOT NULL,
  target_word_count INTEGER,
  parameters JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI generation history
CREATE TABLE ai_generation_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  template_id UUID REFERENCES ai_templates(id),
  seed_keyword TEXT NOT NULL,
  generated_title TEXT,
  generated_outline JSONB,
  article_id UUID REFERENCES articles(id),
  prompt_used TEXT,
  completion_tokens INTEGER,
  prompt_tokens INTEGER,
  status TEXT CHECK (status IN ('requested', 'completed', 'failed', 'edited', 'published')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- User management
CREATE TABLE platform_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  password_hash TEXT,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User site access
CREATE TABLE user_site_access (
  user_id UUID NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'editor', 'viewer')) DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, site_id)
);

-- Create indexes for performance
CREATE INDEX idx_sites_location ON sites(location_name);
CREATE INDEX idx_accommodations_city ON accommodations(city);
CREATE INDEX idx_accommodations_type ON accommodations(accommodation_type);
CREATE INDEX idx_tours_type ON tours(tour_type);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published ON articles(published_at);
CREATE INDEX idx_media_file_type ON media(file_type);
CREATE INDEX idx_categories_type ON categories(type);

-- Enable Row Level Security
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY site_access_policy ON sites
  FOR ALL USING (
    (auth.uid() IN (SELECT user_id FROM user_site_access WHERE site_id = id))
    OR 
    (auth.uid() IN (SELECT id FROM platform_users WHERE role = 'admin'))
  );