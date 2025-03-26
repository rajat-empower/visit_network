# Article Page Template

This document explains the new article page template and how to use it in the Visit Slovenia website.

## Overview

The article page template displays articles from the `articles` table in the database. It includes:

- Featured image at the top of the page
- Article title with custom styling
- Author information
- Tags (displayed as clickable filters)
- Formatted article content (HTML)
- Right sidebar with:
  - Weather widget
  - Latest articles section

## Database Schema

The articles table has the following structure:

```sql
CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  feature_img TEXT,
  author TEXT,
  tags TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

- `title`: The article title
- `content`: HTML content of the article
- `feature_img`: URL to the featured image
- `author`: Name of the article author
- `tags`: Comma-separated list of tags (e.g., "Slovenia, Travel, Europe")
- `created_at`: Timestamp when the article was created
- `updated_at`: Timestamp when the article was last updated

## How to Add a New Article

Articles can be added directly to the database using SQL or through the admin interface (when implemented). Here's an example of adding an article using SQL:

```sql
INSERT INTO articles (
  title, 
  content, 
  feature_img, 
  author, 
  tags
) VALUES (
  'Article Title',
  '<p>HTML content goes here...</p>',
  'https://example.com/image.jpg',
  'Author Name',
  'Tag1, Tag2, Tag3'
);
```

## URL Structure

Articles are accessible at the following URL patterns:

```
/articles/article-title-in-slug-format
/travel-guides/article-title-in-slug-format
```

Both routes point to the same ArticlePage component. For example, an article titled "Exploring the Hidden Gems of Slovenia" would be accessible at either:

```
/articles/exploring-the-hidden-gems-of-slovenia
/travel-guides/exploring-the-hidden-gems-of-slovenia
```

The `/travel-guides/:slug` route is used for compatibility with existing links in the application.

## Running the Migrations

To set up the articles table and add a sample article, run the migration script:

1. Make sure you have the Supabase service key in your environment variables:

```bash
export SUPABASE_SERVICE_KEY=your_service_key_here
```

2. Run the migration script:

```bash
node src/utils/applyArticlesMigrations.js
```

This will:
- Update the articles table with the new fields
- Add sample articles to test the template:
  - "Exploring the Hidden Gems of Slovenia"
  - "Slovenia Visa and Entry Requirements for European Getaway"

## Customization

The article page template uses the following CSS for the H1 title:

```css
h1 {
  font-size: 30px;
  font-weight: 800;
  margin: 15px 0 20px;
}
```

You can customize the styling by modifying the inline styles in the `ArticlePage.tsx` component.

## Components Used

The article page template uses the following components:

- `Header` and `Footer` for the page layout
- `WeatherWidget` for displaying weather information in the sidebar
- `PageTitle` for SEO optimization
- Card components from the UI library for the sidebar sections

## Future Enhancements

Potential future enhancements for the article page:

1. Related articles section based on tags
2. Social sharing buttons
3. Comments section
4. Reading time estimate
5. "Published on" and "Last updated" dates
6. Author bio section with photo
