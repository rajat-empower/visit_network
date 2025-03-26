Here's a structured prompt you can use to instruct your AI development tool to create the hotel detail page:

---

**Create a Hotel Detail Page Template**  
**Objective:** Replicate the structure and functionality of [this example page](https://visitslovenia.com/places-to-stay/hostel-2/Ljubljana/ibis-styles-ljubljana-the-fuzzy-log/) while dynamically populating content from a Supabase database.

**Required Components:**  
1. **Breadcrumbs**  
   - Format: `Home > [Location] > [Hotel Category] > [Hotel Name]`  
   - Dynamically generate from database fields: `location`, `category`, `hotel_name`  

2. **Header**  
   - Display `hotel_name` from database as H1  
   - Include star rating (if available in database field `rating`)  

3. **Hotel Image**  
   - Primary image gallery (support multiple images from `images` array field)  
   - Add image slider/carousel functionality  

4. **Description Section**  
   - Render `description` text field from database  
   - Format with responsive typography  

5. **Google Map Integration**  
   - Embed dynamic Google Map using `latitude` and `longitude` fields from database  
   - Add marker with hotel name  

6. **Popular Facilities**  
   - Display icons/tags for amenities from `facilities` array field  
   - Use grid layout similar to reference page  

7. **Accordion Sections**  
   - **What's Nearby**: Populate from `nearby_attractions` array  
   - **Restaurants**: Use `nearby_restaurants` array  
   - **Getting Around**: Use `transportation_options` array  
   - Each accordion item should show name + distance (e.g., "Ljubljana Castle • 0.7 km")  

**Technical Requirements:**  
- Mobile-responsive design  
- Use Tailwind CSS (or match existing site's framework)  
- Implement loading states while fetching from Supabase  
- Add error handling for missing data  
- Use Supabase client library for data fetching  

**Database Fields Mapping Example:**  
```javascript
{
  hotel_name: "text",
  location: "text",
  category: "text",
  description: "text",
  images: ["url1", "url2"],
  rating: "number",
  facilities: ["wifi", "parking", ...],
  latitude: "number",
  longitude: "number",
  nearby_attractions: [{name: "text", distance: "text"}, ...],
  nearby_restaurants: [...],
  transportation_options: [...]
}
```

**Additional Notes:**  
- Match the visual hierarchy and spacing of the reference page  
- Implement smooth accordion interactions (CSS transitions)  
- Ensure SEO-friendly markup for hotel names and locations  
- Add schema.org structured data where appropriate  

---

**Testing Instructions:**  
1. Verify all elements populate correctly from Supabase  
2. Test mobile breakpoints  
3. Validate Google Map integration with sample coordinates  
4. Check accordion expand/collapse functionality  

**Required Supabase Setup:**  
```sql
-- Example table structure
create table hotels (
  id uuid primary key,
  hotel_name text,
  location text,
  category text,
  description text,
  images text[],
  rating numeric,
  facilities text[],
  latitude double precision,
  longitude double precision,
  nearby_attractions jsonb,
  nearby_restaurants jsonb,
  transportation_options jsonb
);
```

This prompt provides clear structure while allowing flexibility for your AI tool to implement specific UI/UX decisions. Adjust field names to match your actual Supabase schema.