
# 🚀 Project Name: [visit.network]

## 📖 Overview
[Your Project Name] is a [brief description of what the project does].  
It is built using **Lovable.dev**, **Shadcn UI**, and **Supabase**.

## 🎯 Project Goals
- [Goal 1]: [Describe the main purpose of the project]
- [Goal 2]: [Mention the target users or problem it solves]
- [Goal 3]: [Any additional project-specific objectives]

## 🛠 Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS + Shadcn UI
- **Backend:** Supabase (Database & Authentication)
- **Deployment:** Vercel + Supabase Hosting

## 🚀 Features
- ✅ **Authentication System** (Login/Register with Supabase Auth)
- ✅ **Dashboard with Real-Time Updates**
- ✅ **CRUD Operations using Supabase**
- ✅ **Responsive UI with Shadcn Components**
- ✅ **Dark Mode Support**

## 🏗 Project Structure


Project Name - VisitNetwork Travel CMS

Overview

We are building a custom CMS for our portfolio of travel domains. The platform will allow us to build a new website for each domain with each site being focussed on an entire country, or on a city or region within a country. We are replicating a custom wordpress theme but want this new platform to be better in a number of ways ;:


- Be easier to manage and deploy across multiple domains.
- Offer better performance and scalability.
- Integrate AI-driven features for faster content creation and SEO optimization.
- Ensure each site uses best-practice SEO techniques and can be upgraded with traditional coding or no-code AI tools.

The initial MVP should replicate the functionality of our existing sites (e.g., VisitRome.com, VisitSlovenia.com) while laying the groundwork for future enhancements.



The core requirements for the initial release would be;

To create beautiful responsive web sites aimed at visitors to the country, city or region. 
To use programmatic SEO techniques to create large scale content that covers Places to Stay, Tours and Activities, and extensive Travel Guides. 
To monetise with affiliate links to partners including Viator.com and ZenHotels.com. We have API access to these 3rd parties and use an importer to bring content into our site to populate these pages. 
We will use a custom backend dashboard to allow the integration of AI driven content tools that allow us to modify and enhance content imported from 3rd party sources. 
We will add custom tools that allow us to add value to all 3rd party content - for example, to find the urls for hotels or apartments on other 3rd party sites such as booking.com or hotels.com and to add these links to the relevant property pages on our site and to add our affiliate link to these external urls. We will create an experience similar to trivago.com
We will do the same as above for our Tours and Activities content with Viator.com as our primary source of content. 
We will define the most important plugins and features from our Wordpress version and replicate and improve upon these in our custom platform. 
We will build in features and processes to ensure best practice SEO techniques to help ensure our content ranks highly in organic search. This will include AI driven suggestions for titles, meta data, keyword density and any other factors that will determine good on-page ranking factors. This will include a method to generate and optimise article content to include relevant internal links based on creation of a custom RAG from our programmatic content. 
We will ensure we use best practice database design to ensure that all content categories can be related to one another to ensure that our site is well categorised and that all pages can be linked tightly together with relevant cross-linking as appropriate. 
Enhanced AI editing tools will allow custom AI content to be created in bulk and added to any page template in slots defined within the page template
Article publishing AI - research category and subject matter based on city or country and create/publish content with best practice SEO [internal links, external links, media etc]. Allow the prompts to be updated to improve this over time. Detailed instructions for this provided later in this document. 
Integration of custom functionality or replication of functionality currently provided by plugins such as RankMath, LinkWhisper etc. 




Project Goals
We want to ensure the design of beautiful travel sites aimed at being very useful to travellers but also being highly optimised for search engines. Each site will use a combination of AI and editor created article content covering everything travel related for the location along with 100s or 1000s of programmatically created pages that will take their content from APIs for the Places to Stay and Tours and Activities sections. These are powered by content from the APIs provided by RateHawk.com and Viator.com. The custom engine needs to interface with these APIs and provide an import feature that pulls content for the specified location or locations. This content will then be populated into the database [Supabase] and presented on the site on custom templates. Each of these pages will represent either a tour, activity or place to stay. 
Within these top level categories will be sub categories such as Hotels, Apartments, Bed and Breakfast etc. We need the admin panel to allow these template pages to be enhanced with AI content. 
Here is an example based on the site - VisitRome.com. As we have an existing site using Wordpress we can refer to URLs on this site to better explain what the new engine needs to do. Keep in mind the overall objective is to generate revenue from affiliate links. Every page on the site needs to present useful content for a visitor but should also be optimised to have the user exit our site to make a booking on a 3rd party site using our affiliate links. Here is a hotel page on Viasitrome.com. The core of this content was imported from our integration with the RateHawk.com API. They provide a deep link to their B2C brand called ZenHotels.com. Here is our page - https://visitrome.com/places-to-stay/the-one-boutique-hotel-spa-rome
We want to use AI to enhance these pages with the following example improvements;

1. Add additional traveller reviews that might be found on other 3rd party web sites
2. Find the same property on 3rd party sites such as booking.com and hotels.com and add a comparison feature with affiliate links to these booking sites. This will increase the chances that we can monetise visits to these pages. 
3. Rewrite the descriptions for each property to offer a better user experience and to provide an overall more optimised page for SEO purposes. 
4. Find additional attractions and things to do in the vicinity of each property to add value to the page and to create internal links to other parts of the site. For example, to highlight and link to pages within the Tours and Attractions section. This cross-linking needs to be prevalent across the entire site. 
5. Flexibility that we can further enhance the content over time with new AI features.

Ensuring highly optimised SEO content through each site created by the platform

You now need to think like a world-class SEO with 20 years of experience creating travel content that ranks highly on Google. Your job is to provide an input into the platform specification so that every site has best SEO practice inbuilt from the outset. 

[Output from the SEO expert that can be used to ensure the platform is built with best practice SEO at the forefront]
Building a successful travel site that ranks well on Google involves a strategic blend of technical SEO, high-quality content creation, and continuous optimization. As an experienced SEO professional, I’ll outline the primary considerations, keyword and topical research methods, the creation of a comprehensive topical map, and the essential elements of each article to ensure readability and competitive ranking. Additionally, I’ll discuss how to design a flexible custom engine that adheres to best SEO practices while allowing for ongoing improvements and manual content tweaks.
Architecture and Navigation

We need to define the architecture of the site. This will be the same for each site created by the platform but we should have the ability to manually change it if required for a specific site.  The current top level menu for an example site would be; Home, Tours and Tickets, Places to Stay, Travel Guides, Contact Us. The  site architecture should take this into account. 

We have created these additional guidelines based on a review of visitrome.com. These are also designed to be inputs for the new platform.
Below is a detailed outline covering site architecture, homepage layout, internal pages structure, and link organization.

1. Site Architecture Overview
A well-structured site architecture ensures optimal user experience, ease of navigation, and enhanced SEO performance. The architecture should be intuitive, scalable, and facilitate the seamless discovery of content.
1.1. Main Components
Homepage
Tours and Tickets - powered by viator.com
Places to Stay - powered by RateHawk.com
Dining - to be added later - perhaps with content scraped from Google My Business
Events
Travel Guides [blog]
About Us
Contact Us
User Account (Optional)
Search Functionality
Footer with Essential Links
1.2. Hierarchical Structure
Home
│
├── Tours and Tickets
│   ├── Keyword Search
│   ├── Categories [comes from API partner]
│   
├── Places to Stay
│   ├── Hotels
│   ├── Apartments
│   ├── Bed and Breakfast
│   └── + more categories
│
├── Travel Guides [ blog]
│   ├── Transportation
│   ├── Safety
│   ├── Local Etiquette
│   └── Budgeting
│   └── + more categories as defined in admin
│
├── About Us
├── Contact
├── User Account
└── Search


2. Homepage Layout and Structure
The homepage serves as the gateway to the entire website, highlighting key areas and guiding users to explore further.
2.1. Header
Logo: Positioned at the top-left for brand recognition.
Navigation Menu: Horizontal menu with main categories (e.g., Travel Guides, Places to Stay, Tours and Tickets).
Search Bar: Prominently placed for easy access.
User Account Links: Sign Up/Login options.
Social Media Links  to be defined in admin
2.2. Hero Section
High-Quality Image or Slideshow: Showcasing iconic landmarks or vibrant city life.
Headline: Engaging tagline (e.g., "Discover the Heart of Rome").
Call-to-Action (CTA) Buttons: Prominent buttons like "Plan Your Trip," "Explore Attractions," or "Find Accommodation."
2.3. Featured Sections
Top Attractions: Highlighting must-see places with images and brief descriptions.
Upcoming Events: Showcasing major events or festivals.
Accommodation Highlights: Featuring popular or unique lodging options.
Travel Tips: Quick links to essential travel advice.
2.4. Interactive Elements
Map Integration: Interactive map displaying key locations and attractions.
Itinerary Planner: Tool for users to create and customize their travel plans.
Testimonials/Reviews: User-generated content to build trust.
2.5. Blog Highlights
Latest Articles: Displaying recent blog posts or travel stories.
Popular Guides: Linking to comprehensive travel guides.
2.6. Footer
Quick Links: Redundant navigation to main categories.
Contact Information: Email, phone number, and physical address if applicable.
Social Media Icons: Links to social profiles.
Newsletter Signup: Form to capture email subscribers.
Legal Links: Privacy Policy, Terms of Service.

3. Internal Pages Layout and Structure
Each internal page should maintain consistency in layout while catering to specific content needs.
3.1. Destination Guides
Introduction Section:
Overview of the destination.
Key facts and statistics.
Subsections:
Neighborhoods: Detailed descriptions with maps.
Day Trips: Suggested excursions outside the main city.
Itineraries: Sample travel plans for different durations and interests.
Multimedia: Images, videos, and interactive maps.
CTAs: Links to related attractions, accommodations, and booking options.
Sidebar (Optional):
Quick links to related content.
User reviews or ratings.
3.2. Attractions
Attraction Listing:
Categorized by type (e.g., Museums, Parks).
Search and filter options.
Individual Attraction Pages:
Detailed descriptions.
Opening hours, ticket information.
Location map.
Photos and videos.
User reviews and ratings.
Related attractions links.
3.3. Accommodation
Accommodation Listing:
Categories (Hotels, Hostels, Apartments).
Filters for price, location, amenities.
Individual Accommodation Pages:
Detailed descriptions.
Pricing and availability.
Booking options.
Photos and virtual tours.
User reviews.
Nearby attractions and transportation info.
3.4. Travel Guides - Blog/Articles
Blog Listing Page:
Latest posts with excerpts and featured images.
Categories and tags for easy navigation.
Individual Article Pages:
Engaging headlines with primary keywords.
Well-structured content with subheadings.
Multimedia elements (images, videos).
Author information and publication date.
Social sharing buttons.
Comments section for user interaction.
3.5. About Us
Company Overview:
Mission and vision statements.
Unique Selling Propositions (USPs):
What sets the site apart from competitors.
Testimonials:
User feedback and success stories.
Call-to-Action:
Encourage users to explore the site or contact for more information.
3.6. Contact
Contact Form:
Fields for name, email, subject, and message.
Contact Information:
Email addresses, phone numbers, physical address.
Map Integration:
Interactive map showing the location if applicable.
Social Media Links:
Direct links to social profiles for additional contact options.
3.7. User Account (Optional)
Registration/Login Pages:
Forms for creating an account or signing in.
Dashboard:
Personalized content such as saved itineraries, bookings, and preferences.
Profile Management:
Options to update personal information and settings.
Content Interaction:
Ability to leave reviews, comment on articles, and participate in community forums.
3.8. Search Functionality
Search Bar:
Accessible from all pages, preferably in the header.
Search Results Page:
Display relevant results with filters and sorting options.
Advanced Search Options:
Filters by category, location, date, etc.

4. Link Structure and Navigation
A well-organized link structure enhances user experience and SEO performance by ensuring easy navigation and effective distribution of link equity.
4.1. Internal Linking Strategy
Breadcrumb Navigation:
Displayed at the top of internal pages to show the user's location within the site hierarchy.
Contextual Links:
Within content, link to related pages and articles to encourage deeper exploration.
Footer Links:
Redundant links to main categories and important pages for accessibility from any page.
Sidebar Links:
Quick access to popular or related content, especially on blog and article pages.
4.2. URL Structure
Clean and Descriptive URLs:
Use readable URLs that reflect the content hierarchy (e.g., www.example.com/attractions/museums/louvre).
Consistent Naming Conventions:
Maintain uniformity in URL structures across similar content types.
Keyword Optimization:
Incorporate relevant keywords naturally within URLs for better SEO.
4.3. Navigation Menu Design
Logical Grouping:
Organize menu items into clear categories and subcategories.
Dropdown Menus:
Use for displaying subcategories without cluttering the main navigation bar.
Sticky Navigation:
Keep the navigation menu visible as users scroll for easy access.
4.4. Sitemaps
XML Sitemap:
Ensure it includes all important pages for search engine indexing.
HTML Sitemap:
Provide a user-friendly sitemap page to aid navigation and accessibility.

5. Content Organization and Topical Mapping
Organizing content around core themes and subtopics enhances authority and facilitates comprehensive coverage of the subject matter.
5.1. Core Themes
Travel Guides
Tours & Tickets
Places to Stay
5.2. Subtopics and Clusters
Each core theme should have associated subtopics, forming content clusters that interlink to establish topical authority.
Example: Travel Guides
Neighborhoods
History and Overview
Key Attractions
Local Culture
Day Trips
Nearby Cities
Nature Excursions
Cultural Experiences
Itineraries
3-Day Trips
Weekend Getaways
Thematic Itineraries (e.g., Culinary, Historical)
5.3. Content Interlinking
Pillar Pages:
Comprehensive overviews of core themes (e.g., "Ultimate Guide to Rome").
Cluster Pages:
Detailed articles on subtopics linked to the pillar page.
Cross-Linking:
Link related clusters across different core themes to enhance site connectivity.

6. Detailed Page Layout Specifications
Providing detailed specifications for each page type ensures consistency and clarity during the development process.
6.1. Homepage
Sections:
Header, Hero, Featured Sections, Interactive Elements, Blog Highlights, Footer
Components:
Responsive design, high-quality multimedia, clear CTAs
Functionality:
Interactive map, search functionality, dynamic content sections
6.2. Internal Pages (e.g., Attraction Page)
Header:
Consistent with homepage
Main Content:
Title with primary keyword
Image gallery or featured image
Detailed description
Key information (hours, tickets, location)
User reviews and ratings
Related attractions links
Sidebar:
Quick links, promotional banners, related content
Footer:
Consistent with homepage
6.3. Blog/Article Pages
Header:
Consistent with other pages
Main Content:
Engaging headline
Author and date information
Featured image
Well-structured content with headings and subheadings
Multimedia elements (images, videos)
Social sharing buttons
Comments section
Sidebar:
Related articles, popular posts, newsletter signup
Footer:
Consistent with homepage
6.4. Contact Page
Header:
Consistent with other pages
Main Content:
Contact form
Contact information (email, phone, address)
Interactive map
Social media links
Footer:
Consistent with homepage

7. Technical Considerations
Ensuring the technical foundation supports the desired architecture and layout is crucial for performance and SEO.
7.1. Responsive Design
Mobile-Friendly Layouts: Ensure all pages are optimized for various screen sizes.
Touch-Friendly Elements: Buttons and links should be easily clickable on touch devices.
7.2. Page Speed Optimization
Image Optimization: Use compressed images without compromising quality.
Minified Code: Reduce CSS, JavaScript, and HTML file sizes.
Caching Strategies: Implement browser and server-side caching.
7.3. SEO Best Practices - see more detailed SEO requirements elsewhere in this documet
Meta Tags: Unique and descriptive meta titles and descriptions for each page.
Header Tags: Proper use of H1, H2, H3 tags to structure content.
Alt Text: Descriptive alt attributes for all images.
Schema Markup: Implement structured data for rich snippets.
7.4. Accessibility
ARIA Labels: Enhance navigation for screen readers.
Keyboard Navigation: Ensure all interactive elements are accessible via keyboard.
Contrast Ratios: Maintain sufficient contrast for text and background elements.
7.5. Security
HTTPS: Secure the site with SSL certificates.
Regular Updates: Keep all software and plugins up to date.
Data Protection: Implement measures to protect user data, especially for forms and user accounts.

8. Link Structure Diagram (Example)
Creating a visual representation of the link structure can aid in understanding the site's organization. Here's a simplified diagram:
Home
│
├── Tours and Tickets
│   ├── Museums
│   │   ├── Vatican Museums
│   │   └── Capitoline Museums
│   ├── Parks
│   │   ├── Villa Borghese
│   │   └── Gianicolo Hill
│   └── Historical Sites
│       ├── Colosseum
│       └── Roman Forum
│
├── Places to Stay
│   ├── Hotels
│   ├── Hostels
│   ├── Apartments
│   └── Unique Stays
│
├── Travel Guides - Blog/Articles
│   ├── Neighborhoods
│   │   ├── Central Rome
│   │   └── Trastevere
│   ├── Day Trips
│   │   ├── Ostia Antica
│   │   └── Tivoli
│   └── Itineraries
│       ├── 3-Day Rome
│       └── Weekend Getaway
│
├── About Us
├── Contact
├── User Account
└── Search


9. Recommendations for Information Architects
When using this documentation as an input for creating a similar site for a different city, consider the following:
9.1. Customization for the New City
Local Insights: Incorporate unique aspects, culture, and attractions specific to the new city.
Localized Content: Ensure all guides, tips, and articles are tailored to the new destination.
Visual Assets: Use high-quality images and videos relevant to the new city.
9.2. Scalability
Modular Design: Allow for easy addition of new sections or categories as the site grows.
9.3. SEO Optimization
Keyword Research: Conduct thorough keyword analysis specific to the new city.
Local SEO: Optimize for local search queries and include geo-specific schema markup.
Content Clusters: Develop comprehensive topical maps around the new city's unique features.
9.4. User Experience (UX)
Intuitive Navigation: Maintain a user-friendly interface that facilitates easy exploration.
Personalization: Implement features that allow users to customize their experience based on preferences.
Interactive Features: Incorporate tools like maps, itinerary planners, and booking integrations.
9.5. Technical Implementation
Performance Optimization: Ensure fast loading times and responsive design.
Security Measures: Implement robust security protocols to protect user data.
Accessibility Compliance: Adhere to accessibility standards to cater to all users.

10. Sample Specification Document Outline
Below is an outline that an information architect can use to develop a specification document based on the above architecture.
10.1. Introduction
Project Overview
Objectives
Scope
10.2. Site Architecture
Main Components
Hierarchical Structure
10.3. Page Layouts
Homepage
Internal Pages (Destination Guides, Attractions, etc.)
Blog/Article Pages
About Us and Contact Pages
10.4. Navigation and Link Structure
Main Navigation Menu
Internal Linking Strategy
URL Structure Guidelines
10.5. Content Organization
Core Themes and Subtopics
Content Clusters and Interlinking
10.6. Technical Specifications
Responsive Design Requirements
SEO Best Practices
Performance Optimization
Security Measures
10.7. User Interface (UI) Elements
Header and Footer Design
Buttons and CTAs
Forms and Interactive Elements
10.8. SEO and Accessibility
Meta Tagging Standards
Schema Markup Implementation
Accessibility Guidelines
10.9. Tools and Technologies
Analytics and Monitoring Tools
Third-Party Integrations
10.10. Maintenance and Updates
Content Update Procedures
Technical Maintenance Schedule
SEO Auditing Processes
10.11. Appendices
Wireframes or Mockups
Style Guides
Glossary of Terms


The above section provides a comprehensive framework based on industry best practices for developing a city-focused travel website. This structure ensures a user-friendly experience, robust SEO performance, and scalability for future growth. An information architect can utilize this detailed outline to create a specification document tailored to a different city's unique attributes, ensuring consistency and excellence in site development.

Design Considerations

The platform needs to use a template or theme approach to allow us to create beautifully designed, mobile responsive travel sites for any location. An example of a site we own that is to be replicated by the engine would be visitrome.com. Some notable design requirements we need to be replicated;

Home page - hero section with background image, site name and tag line
Shortcodes that output content from data driven sections  - for example to show 6 hotels with links to more Places to Stay or to show 6 tours with links to more Tours and Tickets. 
Summaries and links to article or blog content with images and excerpts. 

A standard header and footer is required for each site with some basic management for the header and footer content in the admin dashboard. The header should always include a link to the contact form and links to any social channels for the site. e.g.  instagram, facebook, youtube etc. We would need to be able to specify these links in a Site Options area within an admin dashboard secured with a username and password. 

We also need to ensure that every site created by the platform is lightning fast with A+ scores on the main page speed loading services. All code and database queries need to be highly optimised with appropriate caching. 

Our sites are potentially very large. They may have 100k+ pages in some instances. We need to keep these in mind when creating the architecture. All media associated with the data-driven programmatic pages will be stored external in the bunny.net CDN. 


Database Design Considerations

The current custom Wordpress theme uses custom page  templates to populate the programmatic SEO sections. The records imported from the API connections are stored within the Wordpress DB. In the new platform we want to use more efficient code to create a better user experience with faster page rendering. Here’s a suggestion on the database method;

When designing a database for the platform (10,000+ records) with React + Supabase + Bunny.net CDN, prioritize these key considerations:

---

1. Database Schema Design
- **Normalization**  
  Split data into logical tables (e.g., `hotels`, `tours`, `amenities`, `pricing`) to minimize redundancy. Use relationships:
  ```sql
  CREATE TABLE hotels (
    id UUID PRIMARY KEY,
    name TEXT,
    location GEOGRAPHY(POINT), -- Use PostGIS for geospatial queries
    seo_slug TEXT UNIQUE -- For SEO-friendly URLs
  );

  CREATE TABLE tours (
    id UUID PRIMARY KEY,
    hotel_id UUID REFERENCES hotels(id),
    price NUMERIC,
    availability JSONB -- Store dynamic availability data
  );
  ```
- **Denormalization for Performance**  
  Cache frequently accessed fields (e.g., `hotel_name` in `tours`) if joins become costly.

- **JSONB for Flexible Data**  
  Store unstructured fields (e.g., dynamic descriptions, translations) in JSONB columns.

---

2. Performance Optimization
- **Indexing**  
  Add indexes on columns used in `WHERE`, `ORDER BY`, or joins:
  ```sql
  CREATE INDEX idx_hotels_location ON hotels USING GIST(location);
  CREATE INDEX idx_hotels_seo_slug ON hotels(seo_slug);
  ```
- **Materialized Views**  
  Precompute complex queries (e.g., "top-rated hotels") for faster access.

- **Connection Pooling**  
  Configure Supabase’s `pgBouncer` to handle concurrent React frontend requests.

---

3. Media Handling with Bunny.net
- **Store Only CDN URLs**  
  Keep media references in Supabase:
  ```sql
  ALTER TABLE hotels ADD COLUMN image_urls TEXT[];
  ```
- **Optimize Assets**  
  Use Bunny.net’s image compression (e.g., `https://cdn.example.com/hotel.jpg?width=800&webp=1`).

---

4. SEO-Centric Structure
- **SEO Metadata Table**  
  Store titles, meta descriptions, and OpenGraph tags:
  ```sql
  CREATE TABLE seo_metadata (
    entity_id UUID PRIMARY KEY, -- References hotels.id or tours.id
    title TEXT,
    description TEXT,
    canonical_url TEXT
  );
  ```
- **SSR/SSG with Next.js**  
  Pre-render pages using Supabase data fetched at build time (SSG) or runtime (SSR).

---

5. Security
- **Row-Level Security (RLS)**  
  Restrict access to sensitive data:
  ```sql
  CREATE POLICY hotels_read_policy ON hotels
  FOR SELECT USING (published = true); -- Allow public read access only to published hotels
  ```
- **API Security**  
  Use Supabase anonymous keys for public data and JWT tokens for authenticated actions.

---

6. Migration Strategy
- **Batch Import**  
  Use a script to migrate WordPress data to Supabase in chunks (avoid timeouts):
  ```javascript
  // Example: Migrate hotels using Supabase JS client
  const { data, error } = await supabase
    .from('hotels')
    .insert(wp_hotels_batch);
  ```
- **Data Validation**  
  Ensure consistency with constraints (e.g., `NOT NULL`, `CHECK`).

---

7. Cost & Scalability
- **Monitor Query Costs**  
  Avoid full-table scans; use Supabase’s logging to identify slow queries.
- **Auto-Scale CDN**  
  Bunny.net’s tiered pricing scales with traffic; enable "Pull Zone" optimizations.

---

8. User Experience
- **Instant Search**  
  Implement full-text search with Postgres:
  ```sql
  CREATE INDEX idx_hotels_search ON hotels USING GIN(to_tsvector('english', name || ' ' || description));
  ```
- **Lazy-Load Images**  
  Use React Intersection Observer to load images on scroll.

---

Tools & Integration
- **Supabase Studio**  
  Manage tables, relationships, and RLS via the dashboard.
- **Vercel + Next.js**  
  Deploy React with serverless functions for API routes.
- **Apache JMeter**  
  Load-test with 10k+ records to validate performance.

By combining Supabase’s scalability, React’s interactivity, and Bunny.net’s CDN, you’ll achieve a fast, SEO-friendly platform. Start with a normalized schema, optimize with indexes/materialized views, and enforce strict RLS policies.



Admin Panel Considerations

While we are basically happy with the control offered by the Wordpress dashboard and the custom plugins we have created for functions related to Places to Stay and Tours and Tickets we need to move away from Wordpress so the core admin functions need to be rebuilt in the new platform. There may be code libraries or frameworks that will make it easier to build this section without coding from scratch. The key features we need from the admin panel/
Authentication with a username and password - only for the admin user at this stage

Blog section CMS - create, modify, delete for articles and article categories - a replication of the Gutenberg editor would be ok

Media Library - which most media will be external at the bunny.net CDN we will still need a media library for the blog functionality. Same sort of thing as Wordpress with ability to upload, delete and manage media. Insertion into posts/articles with control over alt tags and captions is also necessary. 

Manage Tours and Tickets - we need to integrate the connection to the Viator API to allow verification of locations and control over the import of records to the database. As with the current plugin we will upload media to bunny.net and create optimised pages on the front end with the content from the API. 

Manage Places to Stay - integrated with the RateHawk API. Similar functionality to that mentioned for Tours and Tickets above. 

Site Options - for each instance of the platform [i,e. For each domain] we will want to be able to specify - site name, site domain, site tag line, locations [city or country], weather [to be sent to openweather API] and fed to our front end control for real time weather in the sidebar on some of the page templates, site primary and secondary colours, site primary and secondary fonts [probably Google Fonts]. 

We would suggest using existing libraries to build the CMS features that are most similar to Wordpress for the article management features needed in the platform. 

Integrating a lightweight CMS that mimics WordPress’s blog management features can be achieved quickly using modern tools. Below are rapid solutions, categorized by approach:

---

Article Generator


We have used tools like Cuppa.Ai to produce AI written content that can be auto published to Wordpress. We want to replicate this tool within the dashboard but include some specific customizations that will make it more useful and to offer better integration with the rest of the site. Here is a process flow suggested by QWEN 2.5 to describe how this tool will work;

Process Flow for Automated Article Generation Tool

The following process flow outlines the steps required to build an **Automated Article Generation Tool** as part of your custom content engine. This tool will allow an admin user to input a seed keyword or instruction and generate draft articles with optimized SEO, internal links, shortcodes for featured content, and embedded multimedia (Google Maps, YouTube, etc.). The process is inspired by tools like Cuppa.AI and integrates with multiple LLM engines.

---

1. Input Phase: Admin User Provides Seed Keyword/Instruction
- **Step 1.1:** Admin user logs into the admin panel and navigates to the **Article Generator** section.
- **Step 1.2:** The user inputs:
  - A **seed keyword** (e.g., "Best Hotels in Rome").
  - Optional parameters:
    - Target audience (e.g., families, solo travelers).
    - Content type (e.g., listicle, guide, review).
    - Word count range (e.g., 800–1,200 words).
    - Preferred tone (e.g., formal, casual).
- **Step 1.3:** The system validates the input and passes it to the next phase.

---

2. Keyword Research and Title Generation
- **Step 2.1:** The system uses an LLM engine to perform **keyword research** based on the seed keyword. It queries external APIs or databases (e.g., Google Keyword Planner, SEMrush) to identify:
  - Primary keywords.
  - Secondary/long-tail keywords.
  - Related topics and subtopics.
- **Step 2.2:** Generate a list of **article title suggestions** using the identified keywords. For example:
  - "Top 10 Luxury Hotels in Rome for Families"
  - "Affordable Accommodations in Rome: Budget-Friendly Options"
  - "Rome Hotel Guide: Where to Stay Near Major Attractions"
- **Step 2.3:** Present the list of titles to the admin user for selection or customization.

---

3. Content Outline Creation
- **Step 3.1:** Once the admin selects a title, the system generates a **content outline** using the LLM engine. The outline includes:
  - Introduction.
  - Subheadings (H2, H3) based on related topics and subtopics.
  - Placeholder sections for:
    - Featured content (e.g., Tours and Tickets, Places to Stay).
    - Embedded media (Google Maps, YouTube videos).
    - Internal links to other articles or pages.
- **Step 3.2:** The admin can review and adjust the outline before proceeding.

---

4. Draft Article Generation
- **Step 4.1:** The system uses the selected LLM engine to generate the **draft article** based on the approved outline. Key components include:
  - **Introduction:** Engaging opening paragraph with the primary keyword.
  - **Body Content:** Well-structured paragraphs under each subheading, incorporating:
    - Primary and secondary keywords naturally.
    - Calls-to-action (CTAs) for affiliate links.
    - Placeholder shortcodes for dynamic content (e.g., `[featured-hotels]`, `[top-tours]`).
  - **Conclusion:** Summary with a final CTA.
- **Step 4.2:** The system ensures the article adheres to **SEO best practices**:
  - Meta title and description optimized for search engines.
  - Proper use of header tags (H1, H2, H3).
  - Alt text for images and captions for embedded media.
  - Schema markup for rich snippets (e.g., FAQ schema for travel guides).

---

5. Integration of Dynamic Content
- Step 5.1: Replace placeholder shortcodes with **dynamic content** fetched from your database or APIs:
  - `[featured-hotels]`: Pulls top-rated hotels from the Places to Stay API (RateHawk).
  - `[top-tours]`: Displays popular tours and activities from the Tours and Tickets API (Viator).
- Step 5.2:** Embed multimedia content:
  - Google Maps:Display interactive maps showing locations of hotels, attractions, etc.
  - **YouTube Videos:** Embed relevant videos (e.g., virtual tours, destination highlights).
- **Step 5.3:** Add **internal links** to related articles or pages within the site. For example:
  - Link to "Top Attractions in Rome" from the "Best Hotels in Rome" article.
  - Link to "Budget Travel Tips" from a budget-friendly accommodations article.

---

6. Review and Editing
- **Step 6.1:** Present the completed draft article to the admin user in a **WYSIWYG editor** (similar to Gutenberg). The editor allows the admin to:
  - Make manual edits to the content.
  - Adjust internal links or dynamic content.
  - Add custom media or additional CTAs.
- **Step 6.2:** The admin reviews the article and either:
  - Approves it for publishing.
  - Sends it back for further refinement.

---

7. Publishing and Optimization
- Step 7.1: Once approved, the system publishes the article to the live site. Key actions include:
  - Saving the article in the database with metadata (title, description, canonical URL).
  - Generating an SEO-friendly URL (e.g., `/best-hotels-in-rome`).
  - Pre-rendering the page using SSR/SSG for fast loading times.
- Step 7.2: The system updates the **XML sitemap** and submits it to search engines for indexing.
-Step 7.3: Monitor performance using analytics tools (e.g., Google Analytics, Search Console).

---

8. Iterative Improvement
- Step 8.1: Over time, the system collects data on article performance (e.g., traffic, rankings, conversions).
- Step 8.2: Use this data to refine the LLM prompts and improve future article generation. For example:
  - Adjust keyword density based on ranking trends.
  - Optimize CTAs for higher click-through rates.
  - Update dynamic content placeholders to reflect new API features.

---

Technical Implementation Notes
1. LLM Engine Selection:
   - Use a flexible architecture that supports multiple LLMs (e.g., OpenAI GPT, DeepSeek R1, Claude).
   - Allow the admin to select the preferred engine via the admin panel.

2. API Integrations:
   - Integrate with external APIs for keyword research (e.g., SEMrush, Ahrefs).
   - Fetch dynamic content from RateHawk (Places to Stay) and Viator (Tours and Tickets).

3. Database Design:
   - Store article drafts, metadata, and performance metrics in a scalable database (e.g., Supabase, PostgreSQL).
   - Use JSONB fields for flexible storage of dynamic content placeholders.

4. Frontend Integration:
   - Use React or Next.js for the admin interface.
   - Implement a WYSIWYG editor (e.g., TinyMCE, Draft.js) for manual editing.

5. Performance Optimization:
   - Cache frequently accessed data (e.g., hotel listings, tour details) using Redis or similar tools.
   - Use Bunny.net CDN for media assets to ensure fast page loads.

---

Example Workflow
1. **Input:** Admin enters "Best Hotels in Rome."
2. **Keyword Research:** System identifies keywords like "luxury hotels," "budget accommodations," "family-friendly hotels."
3. **Title Suggestions:** Generates titles such as "Top 10 Luxury Hotels in Rome for Families."
4. **Outline Creation:** Creates an outline with sections like "Introduction," "Luxury Options," "Budget-Friendly Choices," "Nearby Attractions."
5. **Draft Article:** Generates a draft article with dynamic content placeholders and embedded media.
6. **Admin Review:** Admin reviews and approves the article.
7. **Publishing:** Article goes live with optimized SEO and dynamic content.

---

Conclusion
This document outlines the specifications and considerations for building a custom travel website engine. By following these guidelines, developers and AI models can create a platform that is fast, responsive, and highly optimized for both users and search engines. The initial MVP should focus on replicating the core functionality of our existing sites while laying the groundwork for future enhancements and scalability.

