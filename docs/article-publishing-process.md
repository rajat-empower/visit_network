# **Technical Specification: Article Publishing Component for VN Travel Platform**

**Overview & Architecture**

System Architecture: The article publishing component will use a Node.js backend (e.g. Express or NestJS) with a React (or Next.js) frontend. Content is stored in a database (e.g. Supabase/Postgres as per project context) and assets (images) on Bunny.net CDN. The design emphasizes scalability: stateless Node services behind a load balancer, efficient database queries (with indexes for content search), and CDN delivery for static assets.

AI Integration: An AI service (e.g. OpenAI GPT) will be used to generate initial article drafts. The system will incorporate retrieval of existing content (destinations, hotels, tours) to guide the AI for relevant internal links (a Retrieval-Augmented Generation approach). All AI-generated content remains in draft until reviewed by a human. This ensures quality control and moderation before anything goes live.

Workflow Summary: An admin or editor will initiate an article creation (providing a topic or keyword). The backend will use AI to generate a draft article with placeholders for dynamic content and suggested internal links. The draft is loaded into a rich text editor in the dashboard for human editing. An SEO analysis module evaluates the draft and provides suggestions. The editor can tweak content, add media, and accept or adjust AI suggestions (including internal link blocks). Once satisfied, the article is submitted for approval. A user with publishing rights reviews the draft, and upon approval the system marks it as published and displays it on the live site. The following sections detail each aspect of this component.

**1\. Draft Mode & User Approval**

Draft State: All AI-generated articles are created with a `status: "draft"`. In the database, the Article table will include a status field (e.g. Draft, In Review, Published, Archived). New content defaults to Draft. The backend API (e.g. `POST /articles`) will create the article record with status Draft and store the AI-generated content. The content may contain shortcodes/placeholders for dynamic elements (see Internal Linking section).

Approval Workflow: A multi-step approval process is implemented to ensure human oversight:

* Draft Creation: When an editor initiates AI generation, the system produces the article draft and saves it (status Draft). The draft is visible in the editor interface but not on the live site.  
* Editing & Refinement: The editor can modify the draft, and save changes (remaining in Draft status). Versioning can be enabled to keep track of changes.  
* Submit for Review: Once the editor is satisfied, they click “Submit for Approval”. The status may change to “Pending Review” or similar. An admin reviewer is notified (via dashboard notification or email).  
* Human Approval: A user with an “Approver” role opens the article in the editor or a preview mode, reviews content, SEO score, links, etc. They have options to Approve or Request Changes.  
  * If changes are requested, the article returns to Draft with reviewer comments, allowing the editor to make updates.  
  * If approved, the article status flips to “Published” and it becomes live on the site. The publish action triggers any final steps like generating the public URL, updating sitemaps, and clearing relevant caches.

Roles & Permissions: At minimum, define roles such as Editor (can create/edit drafts but not publish) and Admin/Publisher (can approve and publish). The React frontend will show or hide approval controls based on the user’s role. The Node backend enforces these permissions on API endpoints (e.g. only Admin can change status to Published).

Audit Trail: For accountability, store metadata like `created_by`, `last_edited_by`, `approved_by`, and timestamps. This provides an audit log for each article. For instance, when an article is approved, record the approver’s user ID and time.

Publishing Action: On approval, the backend sets status to Published, assigns a unique SEO-friendly slug if not already set, and generates the final HTML content by merging dynamic content (e.g. replacing placeholders with actual content – see section 4). The published article can then be served via the public website (e.g. Next.js pages or a Node rendering service). We will also update the XML sitemap and trigger search engine ping if needed as part of publishing.

**2\. Rich Editor Interface (Gutenberg-like)**

Editor Overview: The platform will include a rich content editor in the dashboard, comparable to WordPress Gutenberg’s block editor. This editor allows creating structured layouts with various content blocks (paragraphs, headings, images, quotes, HTML embeds, etc.) in a user-friendly way. The editor will be implemented with a React-based library to provide a block editing experience. Potential options include:

* Editor.js or TipTap: These libraries support block-based editing and are extensible. They allow defining custom block types (for images, galleries, embedded maps, etc.) and output structured data or HTML.  
* Draft.js or Slate: Provide rich text editing capabilities; additional work is needed to support complex block structures, but can be extended for our needs.

We aim for a modern “block” approach, enabling content to be segmented into components (much like Gutenberg’s concept of blocks). This gives flexibility in rendering and reordering content.

Features: The editor interface will support:

* Text formatting and Headings: Authors can add headings (H1-H4) and formatted text (bold, italic, lists, links) easily via a toolbar. The editor should enforce only one H1 (the article title) and use H2/H3 for sections, aligning with SEO best practices.  
* Images and Media: Users can insert images at any point. An “Image” block allows uploading or selecting an image (integrated with Bunny.net storage – see Image Management). Captions and alt text can be added for each image. For example, an editor can click “Add Image Block”, upload an image file, and the system will display it in the content with a caption field for alt/SEO text.  
* Quotes/Callouts: A block style for quotes or highlights can be included. This would render as a stylized blockquote element in HTML.  
* Embedded Content (HTML/Media): The editor will have an HTML block where raw HTML or embed codes can be inserted. This is useful for things like embedding a YouTube video or a custom map iframe. Additionally, we will provide a user-friendly way to embed common media: e.g. a “Map Block” where the user can input a location or embed code, and a preview of the Google Map appears. Similarly, a “Video Block” for YouTube/Vimeo links could auto-transform the link into an embedded player.  
* Internal Content Blocks: Custom blocks will be created for dynamic internal content. For example, a “Related Hotels” block that, when inserted, will prompt the user to select or automatically display a list of hotels (from our database) relevant to the article’s location/topic. Another could be a “Tour List” block for related tours & activities. These blocks act as placeholders that render structured content (like a list of items with images and links). The AI generation process may auto-insert these as shortcodes which the editor recognizes (see Automated Internal Linking section).

User Experience: The editor UI will have a clean design: a main canvas for content and toolbars/panels for block insertion and settings. Key parts of the interface:

* Top Toolbar: Actions like Undo/Redo, content structure outline, and a “+” button to add a new block​ [gutenberghub.com](https://gutenberghub.com/overview-of-wordpress-block-editor-interface/#:~:text=1)  
  The content structure tool can show word count and document outline (headings map), helping authors see the article structure at a glance (as Gutenberg does).  
* Block Controls: When focusing a block, a contextual toolbar appears (for text blocks: text styles; for image blocks: alignment, etc.). Blocks can be rearranged via drag-and-drop or up/down arrows.  
* Sidebar Panels: On the right side, a sidebar will contain collapsible panels for Document settings (SEO settings, metadata) and Block settings (properties of the selected block). For instance, clicking an image block could show a sidebar panel for that image’s alt text, or clicking an HTML block might show nothing or HTML tips. We will integrate the SEO Optimization panel here as well (see next section).

HTML Output & Storage: The editor will ultimately produce HTML content for the article body (or a JSON representation that can be converted to HTML). We plan to store the article content as HTML in the database (for ease of rendering on the site). However, dynamic blocks (like “Related Hotels”) might be stored as shortcodes or JSON that gets rendered on-the-fly. For example, the content could include a placeholder \[featured-hotels\] which is replaced with actual HTML before publishing. The use of shortcodes allows us to re-fetch fresh data (e.g. updated hotel info) whenever the page renders. During editing, the React editor can show a live preview of these blocks by querying the backend for data.

Collaborative Editing & Versioning: In the MVP, real-time multi-user editing is not required (one user at a time can edit). However, we will maintain version history of drafts (each save could create a new version entry or we integrate with a version control system) for safety. This can be done in the backend by storing a revision log or leveraging Supabase’s row level versioning if available. Real-time collaboration could be a future enhancement (using something like TipTap Collab or Yjs if needed).

**3\. SEO Optimization Tool Integration**

To ensure every article follows SEO best practices, we will integrate an SEO scoring and suggestion tool, similar to RankMath or Yoast SEO in functionality. This will guide the writer in optimizing the content. Key features of this SEO tool:

* Focus Keyword Input: In the article settings (typically in a sidebar panel or top metadata section), the editor can define a *Focus Keyword* (or keyphrase) for the article. This is the main search term we want the article to rank for (e.g., “best hotels in Rome”). The system will use this keyword to run analysis on the content.  
* SEO Score & Checks: The tool will analyze the article content, title, and meta description against a set of SEO criteria and compute a score (e.g. 0-100 or a color-coded rating). This includes: keyword usage, content length, meta tags, link usage, etc. For example, it will check keyword density, whether the keyword appears in the first paragraph, in headings, in the image alt text, etc., and then provide feedback. A library like SEOrd (SEO Analyzer for Node.js) can be used – it offers keyword density analysis, checks for links, headings, and more​ \- [npmjs.com](https://www.npmjs.com/package/seord?activeTab=readme#:~:text=,placement%2C%20keyword%20density%2C%20and%20keyword). This gives us an out-of-the-box set of “SEO rules” to apply (e.g., warn if keyword density is too low or high, if meta description is missing, if no internal links present, etc.).  
  *Example:* The SEO analyzer will report things like: keyword density (e.g. 1.5% of content, which is good), word count (e.g. 1200 words, passes minimum threshold), number of internal/external links, presence of exactly one H1, etc​ [npmjs.com.](https://www.npmjs.com/package/seord?activeTab=readme#:~:text=,Word%20Count%20Analysis)  It also generates SEO messages: warnings (e.g. “Focus keyword not in title” or “No links to external sources”) and good points (“Meta description length is optimal”)​  
  [npmjs.com.](https://www.npmjs.com/package/seord?activeTab=readme#:~:text=,Word%20Count%20Analysis) These messages guide the editor in optimizing the content.  
* Meta Title & Description Editing: The interface will provide fields for SEO Title and Meta Description. By default, the SEO title can prefill from the article title, but the user can override it to be more keyword-rich if needed. The meta description field will have a character counter and guidelines (e.g. “\~160 characters recommended”). The SEO tool will validate these – e.g. warn if meta description is too short or long or missing the focus keyword. RankMath/Yoast do similar checks.  
* Readability Assessment: Apart from pure SEO factors, readability is important. The system will assess the text’s readability (using metrics like Flesch-Kincaid reading ease, sentence length, use of passive voice, etc.). This could be done via the YoastSEO.js library which provides a set of readability analyses (for instance, it can flag long sentences, check transition word usage, paragraph length, etc.). If an external library is not used, we can implement basic rules: “Keep sentences short – X% of sentences contain more than 20 words” or “Use subheadings to break up text every 300 words” (similar to Yoast’s approach). The UI will present readability suggestions separately from SEO (e.g. “Readability: Good, needs improvement on sentence length”).  
* Snippet Preview: Provide a preview of how the article will appear in Google search results (title, URL, meta description). This gives the editor visual feedback if the title or description is too long (they might get truncated in Google). Yoast/RankMath plugins show such a snippet preview. We can generate this dynamically once the user edits the title/meta.

Libraries & APIs Research: Two promising libraries were identified:

* YoastSEO.js – an open-source JS library by Yoast for content analysis. It can generate assessments for SEO and readability, and even has a scoring system​ \- [npmjs.com](https://www.npmjs.com/package/yoastseo#:~:text=YoastSEO).. It might require using it in a Web Worker (as per docs) but can run in-browser to provide instant feedback as the user types.  
* SEOrd (SEO Analyzer) – a Node.js library that analyzes HTML content for on-page SEO factors (keyword density, meta tags, link counts, etc.)​ [npmjs.com.](https://www.npmjs.com/package/seord?activeTab=readme#:~:text=,placement%2C%20keyword%20density%2C%20and%20keyword)  We can call this on the backend whenever an analysis is needed (e.g. when user clicks “Analyze SEO” button).

We will likely use a combination: a quick client-side analysis for instant feedback (some checks can run in the browser for responsiveness), and a more thorough server-side analysis (perhaps triggered on save or on demand) using the Node libraries or even third-party SEO API if needed. If a third-party like RankMath’s API existed that could be leveraged, we would consider it, but since RankMath is a WP plugin, using open-source libraries to replicate its functionality is the approach.

SEO Suggestions UI: In the editor’s sidebar, an SEO Panel will display the following:

* Overall Score: e.g. “SEO Score: 82/100 – Good (Green)”. Possibly break it into sub-scores for SEO and Readability.  
* Focus Keyword field: (editable) and an indication of how many times it appears in content, and controls to add secondary keywords if desired.  
* Checklist of Checks: A list of specific tests with pass/fail indicators. For example: “Focus keyword in title – ✅”, “Text length \> 1000 words – ✅”, “Image alt attributes contain keyword – ⚠ (No images with keyword)”, “Flesch Reading Ease: 70 – ✅” etc. Each item can have a short tip if it’s a warning (e.g. “Consider adding the focus keyword to at least one image alt text”).  
* Suggestions for Improvement: This can be a short textual list distilled from the warnings. E.g. “Add 1-2 internal links to related articles”, “Your paragraphs are a bit long; consider adding subheadings”. These come from our analysis rules.

The suggestions update whenever content changes or when the user requests an update. We’ll provide a “Refresh Analysis” button in case live analysis lags behind.

Readability Mode: We might include a mode where difficult sentences or passive voice phrases are highlighted in the content editor (similar to Hemingway editor). This can help the editor identify what to rewrite. This is a nice-to-have that can be powered by the analysis – e.g. if a sentence is \>20 words, highlight it. Possibly integrate as an optional toggle in the editor.

SEO Data Storage: The focus keyword, SEO title, and meta description will be stored in the database as part of the article metadata table. The SEO score itself doesn’t need storing (it’s computed on the fly), but we may store the last score or status (for reporting or listing articles that need SEO attention).

**4\. Automated Internal Linking & Related Content Suggestions**

One of the platform’s strengths will be leveraging its extensive database of travel content (hotels, tours, attractions) to enrich articles with internal links and related content. This will be automated as much as possible, with AI assistance. There are two aspects: in-line internal link suggestions and embedded related content blocks.

Internal Link Suggestions (Inline): As the article is drafted (by AI or human), the system will scan the text for mentions of topics/entities that have corresponding pages on our site, and suggest linking to them. For example, if the article text mentions “Eiffel Tower”, and we have a travel guide page or attraction entry for Eiffel Tower, the system would suggest turning that phrase into a hyperlink to the Eiffel Tower page. We will implement this by:

* Content Scanning: When an AI draft is generated, it can be instructed to mark certain keywords for linking (or we post-process the text). More simply, the backend will parse the draft content and identify proper nouns or key phrases. We maintain an index of important pages (like attractions, city guides, hotel pages) and their keywords. This index could be as simple as a dictionary of name \-\> URL, or powered by a search engine for fuzzy matches.  
* AI-based suggestions: We can also leverage AI/NLP to identify entities in the text (using an NER – Named Entity Recognition – model) to find locations or attractions. Each identified entity is cross-checked against our database.  
* Suggestions UI: In the editor’s sidebar (or a bottom panel), we will list “Suggested Links”. For each suggestion, show the anchor text and the target page. The editor can approve or ignore each. E.g.: *“Link ‘Louvre Museum’ to Louvre Museum Guide (visitparis.com/louvre-museum)”*. The editor can click an “Add Link” button which will automatically insert the hyperlink in the content. We may also allow “Add All”.  
* Automated insertion: As an option, the AI could have already inserted some links in the draft. However, to ensure accuracy, we might keep them as suggestions for manual approval. (This avoids the AI linking to wrong pages).

This functionality is inspired by Link Whisper, an AI-powered WP plugin that suggests internal links as you write. Link Whisper scans existing site content and, based on the article text, recommends relevant internal links, streamlining the linking process​. 

We aim to replicate that: *“Powered by artificial intelligence, Link Whisper starts suggesting relevant internal links when you start writing your article right within the WordPress editor…”*​

Our system will do similarly in the React editor.

Related Content Blocks: Beyond inline links, the platform will automatically suggest adding rich related content sections in the article – these are more visual, card-based links to other parts of the site, adding value for readers and SEO. Examples include:

* Featured Hotels Block: If the article is about a city or attraction, recommend a block listing top-rated hotels in that area. The AI generation step will include a placeholder `[featured-hotels]` in the draft if it deems it relevant (e.g., in a “Best Hotels in X” article, or a city guide). The system recognizes this shortcode and knows to replace it with a designed block of content​file-lpvgdwxtlq56g62bszsogz. The Node backend will query the Places to Stay data (from our integrated RateHawk API data in our DB) for, say, 3-5 popular hotels relevant to the context. For each hotel, we can display an image, name, a short description or key feature, and a link to the full hotel page (with our affiliate booking links). This all renders within the article as a section titled “Recommended Places to Stay” or similar. If the AI did not insert a shortcode but the topic suggests it (e.g., article category “Accommodation”), the system can still suggest the editor to insert this block via the editor UI.  
* Top Tours Block: Similarly, for articles discussing attractions or cities, a `[top-tours]` placeholder may be used by AI (or suggested by the system)​file-lpvgdwxtlq56g62bszsogz. This gets replaced with a block showing tours/activities (from our Viator API data) related to that location​file-lpvgdwxtlq56g62bszsogz. For example, in an article about “3 Days in Rome Itinerary”, a tours block could show “Colosseum Guided Tour”, “Vatican Museums Skip-the-line”, each linking to the tour page on our site (which then leads to affiliate booking).  
* Related Articles: The system can also suggest linking to other articles on our site. For instance, at the end of a travel guide, suggest “You might also enjoy: \[Another relevant article\]”. This could be a simple list of 2-3 related article links. The relation can be based on category tags or similarity of content (computed via keywords or embedding vectors). These could be inserted automatically in a “Related Posts” section at the bottom.

Automation of Suggestions: During the AI draft generation, we will prompt the AI to *include internal link placeholders and mention points for related content*. The prompt might say: *“When appropriate, include shortcodes like \[featured-hotels\] or \[top-tours\] where relevant, and ensure the content encourages clicking those.”* As per the design, the AI’s draft might contain something like: *“…here are some great places to stay \[featured-hotels\] for your trip.”* The placeholder stands for a dynamic content injection​

file-lpvgdwxtlq56g62bszsogz

After the AI returns the draft, the backend will parse these shortcodes. In Draft Mode, the placeholders remain visible to the editor (possibly as special non-editable tokens or rendered previews). On Publish, the system replaces them with actual content via database queries (Step 5 of the flow)​file-lpvgdwxtlq56g62bszsogz. This ensures the latest data is inserted and that the formatting is consistent.

If the AI does not add them, the system’s SEO analysis might flag missing internal content. For example, if no internal links or blocks are present, the SEO suggestions may say “Consider adding links to related hotels or tours for richer content.” The editor can then manually insert a block via the editor’s block menu (we will have “Related Hotels” and “Related Tours” as available blocks). When inserted manually, the block will trigger a query (through an API call) to fetch relevant items based on the article’s primary location or keyword. The editor might be allowed to refine which items (e.g. maybe choose a different hotel if desired via a small search dialog within the block settings).

Google Maps Embedding: The platform will dynamically embed Google Maps when location context is present. For travel content, showing a map of the location adds value. We have two ways to embed maps: via a Maps block in the editor or automatically for certain templates. We will implement a Map Block the editor can insert anywhere (or the AI can suggest via a shortcode like `[map location=”Golden Gate Bridge”]`). This block, when rendered, will display an interactive Google Map.

* *Implementation:* Use the Google Maps Embed API which allows embedding a map with a simple iframe URL. For example, an iframe with src `https://www.google.com/maps/embed/v1/place?key=API_KEY&q=PLACE_ID_OR_NAME` will show a map for that place. No complex JS needed; just an iframe. As Google states, *“Google Maps Embed API maps are easy to add to your webpage—just set the URL you build as the value of an iframe's src attribute… No JavaScript required.”*​

  We will use this method. The backend can construct the embed URL given a location name or coordinates. Alternatively, for more control, we could use Google Maps JavaScript API to render a map component, but that’s heavier. The embed API is sufficient for static embedding in content.  
* *Automation:* If an article is about a specific attraction or hotel (and we have coordinates), the system can auto-insert a map at the end or in a sidebar. For example, a hotel page could always include a map of its location. For AI-generated free-form articles, we’ll rely on either the AI to include a map shortcode or the editor’s judgment. The SEO tool might not specifically suggest maps, but as a platform feature we consider it a plus for user experience.

Ensuring Relevance: All automated linking should be contextually relevant. We’ll use the article’s metadata (e.g. tags like “Paris”, “Museum”) to query appropriate data. If the article is country-level (e.g. “Visit France”), related content blocks might include top cities, whereas if it’s city-level, include specific places in that city. The internal linking algorithms can be refined over time (using click-through data to see which suggestions are effective).

Technical Approach: For querying existing content, if the content volume is large, a search service might be needed (like Elasticsearch or a lightweight full-text search on the DB). To start, since we have structured data (hotels, tours by location), we can directly query those tables by location name or IDs. For related articles, we can tag articles with keywords and do a simple tag intersection or use a vector similarity search if we embed articles into vectors. We will likely start with a simpler approach: maintain a mapping of locations to content. The Node backend might have endpoints like `/suggest/hotels?location=Rome` returning a JSON of top N hotels, and similar for tours. The editor calls these endpoints to populate the blocks.

Automation vs Manual Control: While AI and algorithms will assist, the human editor has final control. All inserted links/blocks can be edited or removed by the user before publishing. This ensures if a suggestion is off or not needed, it doesn’t go live.

**5\. Dashboard UI Design & Workflow**

We propose a unified Article Publishing Dashboard that consolidates generation, editing, SEO, and approval workflows for efficiency. Below is an outline of the UI/UX design with wireframe descriptions for key screens:

### **5.1 Article List & Generation Screen**

When an editor navigates to the “Articles” section of the admin dashboard, they see a List of Articles in a table view. Each row shows article title, status (Draft/Needs Approval/Published), author, last modified date, SEO score (if calculated), etc. There is a button or link to “Create New Article”.

* New Article (AI Generation) Dialog: Clicking “Create New” opens a form or modal to input initial info for AI generation. This includes:  
  * Topic or Seed Keyword: (Required) e.g. “Best Hotels in Rome” or “Travel Guide for Paris”.  
  * Optional parameters: As outlined in the process flow, we can have advanced options: target audience, tone, content type (listicle vs narrative), word count target. These help shape the AI prompt​file-lpvgdwxtlq56g62bszsogz. The default can be general if not provided.  
  * Site/Category: If the platform manages multiple sites or sections, select which site or category this article belongs to (ensuring AI and linking context are correct).  
  * Generate Draft Button: The user triggers AI generation.

After submission, the backend calls the AI service and may show a loading indicator (or a progress status). Once done, the user is taken to the Editor Interface with the generated content loaded (in Draft status). If multiple title suggestions were part of AI output (the process flow suggests providing title options​.

The UI could first show “AI Suggestions for Title” for the user to pick one, then load the editor with that title and content. (Alternatively, we generate directly one draft title+body based on inputs and allow the user to edit the title in the editor).

### **5.2 Article Editor & Review Screen**

This screen is the core of the component – a full-page editor view for a single article. The layout can be structured as follows:

* Header Bar: At the very top, there’s a breadcrumb or heading indicating the article name (or “New Article”) and status (e.g. “Draft”). On the right side of the header, action buttons: Save Draft, Preview, and if the user is an editor, Submit for Approval; if the user is an admin, Publish (or “Approve & Publish”). There might also be a dropdown for more actions (like “Discard”, “Delete”). The Save Draft may be auto-enabled (autosave) or manual.  
* Main Content Area: This occupies the majority of the screen in the center/left, where the block editor is displayed. Here the content from the AI draft is already populated into blocks. The user can click into any paragraph to edit text, add new blocks via a “+” button between blocks, etc. The content is scrollable. As they scroll, the right sidebar can either scroll along or be fixed.  
* Right Sidebar: This contains multiple panels (tabs or accordions):  
  1. SEO Panel: Shows the SEO analysis results as described earlier (focus keyword field, SEO score, checklist). The user can toggle this panel open to view suggestions. Possibly an “Update Analysis” button here if needed.  
  2. Outline/Navigator: A panel that lists the document outline (all headings) for quick navigation – the user can click a section to jump to that part. (This is similar to Gutenberg’s List View of blocks or the content structure feature​.  
  3. Article Settings: Panel for metadata like publish date (for scheduling), author name, categories/tags selection, canonical URL (if overrides needed), and any template-specific settings. For example, mark if this is a “Featured” article, etc. Also, options like “Allow comments” if relevant.  
  4. AI Assistant Panel (optional): We could have a panel where the user can ask the AI for further help (e.g. “Improve this paragraph” or “Shorten text”). This would be future functionality for interactive AI assistance. Initially, focus is on the static draft and suggestions, but we keep UI extensibility in mind.

* Left Sidebar/Menu: The main admin navigation (not specific to this screen) would be on the far left (e.g. menu for Dashboard, Articles, Places to Stay, Tours, Settings, etc.). This is part of the overall dashboard design using a consistent style (possibly leveraging a UI library like ShadCN or Material-UI for consistency and responsiveness).

**Wireframe Sketch: (Description)**

* Imagine a top bar with the article title and a status pill (e.g. \[Draft\]). Below, a large editable area with text “Title: \[Best Hotels in Rome\]” as an H1 at top (could also be an input field above the editor). The content blocks follow, each outlined when hovered.  
* On the right, a sidebar with tabs. The “SEO” tab is selected, showing a green light and score, a field “Focus Keyword: hotels in Rome”, and a list of items like:  
  * ✅ Focus keyword in Title  
  * ⚠ Focus keyword in 1 out of 5 subheadings (suggest add to more headings)  
  * ✅ Meta description length good (156 characters)  
  * ⚠ 1 internal link (suggest adding at least 3\)  
  * ✅ 3 external links present  
  * ⚠ Reading Ease slightly low (60) – try shorter sentences.  
* The user can click each suggestion for more info.  
* If the user switches to the “Outline” tab, they see a list of headings: e.g., Introduction, Luxury Hotels (H2), Budget Options (H2), Conclusion. Clicking one scrolls the editor to that section.

Responsive Design: The dashboard will be web-based and should be responsive, but realistically authors will use it on desktop mostly. We’ll ensure it works on various screen sizes (the block editor itself is fluid). For smaller screens, the sidebar panels might become collapsible or move to bottom tabs.

### **5.3 Approval Dashboard:**

For an admin who needs to approve content, there could be a dedicated “Pending Approval” section. This could be a filtered list of articles awaiting approval. The admin clicks an article to open the same editor view. In this case, the top bar actions for an approver would show Approve and Send Back buttons. The admin can review SEO panel as well, maybe toggling an “Edit mode” if they want to tweak minor things themselves. Upon clicking Approve, a confirmation dialog might ask “Publish this article now?” and then it goes live. If sending back, a pop-up asks for comments which get attached to the article (the editor might see these comments when they open the article again).

Wireframes: We will prepare simple wireframe diagrams for:

* Article list page with statuses and a “New Article” button.  
* Article editor page showing content area and sidebars (as described above).  
* Approval modal (if separate) or how the approve/send-back buttons appear.

*(Since this text format can’t show actual drawn wireframes, these descriptions serve as a blueprint. Visual wireframes would depict the layout as per the text above.)*

**6\. Image Management & Bunny.net CDN Integration**

High-quality images are vital for travel content. Our platform will integrate a seamless image uploading and management system, using Bunny.net for storage and CDN delivery.

Uploading via UI: In the editor, when an author inserts an Image block and chooses to upload an image, the file should be sent directly to Bunny.net storage rather than stored on our server disk. The workflow:

* The user clicks “Add Image” \-\> “Upload”. This opens a file picker to select an image from their computer.  
* Once selected, the frontend either:  
  * a) uploads the file directly to Bunny storage via a secure URL (more complex, as it would require exposing an upload endpoint with credentials), or  
  * b) sends the file to our Node backend (e.g. via an `/upload` API).  
* We choose (b) for better security: The React app posts the file (multipart form or binary) to a Node API endpoint like `POST /media/upload`. The backend receives the file stream.  
* The Node backend then forwards this file to Bunny.net using Bunny’s Storage API. Bunny.net provides an HTTP API where we can PUT files to a storage zone using our API key. For example, a cURL PUT request with the file and an `AccessKey` header uploads the file to a given path​ [docs.bunny.net.](https://docs.bunny.net/reference/put_-storagezonename-path-filename#:~:text=Upload%20a%20file%20to%20a,it%20will%20be%20created%20automatically)  We will use the Node `https` module or a library to perform this PUT request to Bunny’s storage endpoint. The path will include a folder structure that we define (detailed below).

Storage Structure: We will organize images in Bunny storage by site and content type for easy management. For instance:

bash

CopyEdit

`/[StorageZone]/articles/[articleID]/imagename.jpg`

If articleID is 123 or slug is “best-hotels-rome”, the folder could be `articles/best-hotels-rome/`. Alternatively, organize by date or category if needed. Bunny will auto-create directories in the path if they don’t exist​, so we just need to specify the desired path in the PUT URL.

We must ensure unique file names or segregated folders to avoid collisions. The system might prepend the article slug or a timestamp to the file name. For example, `visitrome-123-main-image.jpg`. The Bunny API returns a success response if uploaded. We then construct the public URL for the uploaded image.

Retrieving & Using Images: Once uploaded, the image is available on Bunny’s CDN. If a Pull Zone is set up, the file can be accessed via a public URL (e.g. `https://media.visitnetwork.com/articles/best-hotels-rome/imagename.jpg`). We store this URL in the article content (the editor’s image block src). The React editor can display the image by using that URL. From Bunny’s perspective, as soon as the file is stored in the Storage Zone, it’s immediately available via the CDN URL (assuming the pull zone is correctly pointed to the storage).

We will likely store image metadata in a Media library table as well (with fields: filename, URL, articleId, alt text, etc.), so that images can be reused or managed. But initially, storing the direct URL in the content and perhaps keeping a reference in the article JSON might suffice.

Bunny API integration details: We will use the Bunny Storage API Key (kept secure on server side) to authorize uploads. The Node backend will have a module for Bunny interactions. For example, using `axios` or `node-fetch`:

js

CopyEdit

`PUT https://{REGION}.storage.bunnycdn.com/{StorageZone}/{path}/{filename}`  

`Headers: AccessKey: YOUR_API_KEY, Content-Type: application/octet-stream`  

`Body: binary file data`

This will create the file on Bunny. (If our Bunny storage zone doesn’t use region segmentation, we omit region or use the default endpoint). Bunny’s docs confirm that missing folders in the path will be auto-created​ simplifying management. We should handle errors (e.g. if API key is wrong or storage quota exceeded) and relay that to the user (display an upload failure message). On success, Bunny returns 201 Created (with maybe some JSON). The Node endpoint then responds back to the client with the public URL of the image. The editor inserts the image into the content with that URL.

Image Optimization: Bunny.net can also handle optimization (they have an Image Optimization add-on where the CDN can resize/compress images on the fly via query params). We might not implement that initially, but we will store large images and possibly use \<img\> `srcset` for responsive sizes. Alternatively, we could integrate a step to create thumbnails – Bunny allows transforming images if we integrate their Optimizer. For now, the focus is storing and retrieving the original upload.

Folder Organization and Retrieval: We will ensure images are stored in correct folders per site. If we host multiple sites in one storage, we prefix paths with site identifier (e.g. `/visitrome/articles/..`). Or we create separate storage zones per site (less likely, more overhead). Using folder prefixes is simpler. The retrieval is simply via the known CDN domain and path. The application will not need a database lookup for the image because the URL is in the content; the browser will fetch from CDN directly when rendering the page.

Other Media Types: If needed, we also support uploading other media (like PDF or videos) similarly to Bunny, but for this spec, primarily images are in scope.

Integration Example: If an editor wants to add an image gallery of a hotel: they click “Add Image”, select multiple files, the UI calls upload for each, and then inserts an image block for each. The images live on Bunny and load quickly worldwide due to CDN caching.

Security: The Bunny storage API key is kept server-side only. No client exposure. The public URLs are world-accessible but guessable; however, since we want them to be public for our site, that’s fine. If any sensitive images existed (unlikely in travel content), we’d restrict them differently.

Cleanup: If an article or image is deleted, we might call Bunny API to delete the file to avoid orphan files. Bunny API has DELETE endpoints to remove files. This can be done on a background job to keep storage clean.

In summary, the integration with Bunny.net ensures that images uploaded through our platform are immediately stored on a CDN for high performance. The UI will make it as simple as WordPress’s media uploader: the user doesn’t need to know about Bunny – it’s behind the scenes. They just see their image appear in the article.

**7\. Process Flow Diagrams & Content Publishing Pipeline**

Bringing it all together, below is a step-by-step process flow for article creation to publication, incorporating the above components (represented in a linear flow that could be depicted in a flowchart diagram):

Step 1: Article Ideation & AI Draft Generation

* 1.1 Editor navigates to “New Article” in dashboard.  
* 1.2 Inputs topic/keyword and optional parameters (location, tone, etc.). Clicks “Generate Draft”.  
* 1.3 Backend formulates an AI prompt, including SEO context (e.g. “Write an article about X with headings, include internal link placeholders, etc.”) and possibly does keyword research via API (optional) to feed LLM additional terms  
* 1.4 AI (LLM) returns a draft: title, outline, and full content. The content is checked for basic issues (length, any disallowed content via moderation filter – see section 8).  
* 1.5 System saves the article in Draft status in DB, and loads it in the Editor UI for the user.

Step 2: Content Editing & Enhancement

* 2.1 The editor reviews the AI-generated draft in the Gutenberg-like editor. They can modify text, add/remove blocks, and correct any factual errors.  
* 2.2 The SEO analysis tool runs automatically (or on request) and shows SEO suggestions. The editor addresses as many as reasonable: adjusting the title to include the focus keyword if missing, tweaking the meta description, adding more content to hit word count recommendations, etc.  
* 2.3 The system has identified internal link opportunities and either already inserted link placeholders or shows suggestions. The editor opens the “Link Suggestions” panel and sees, for example, 5 suggestions. They check a few boxes to accept them, which inserts those links into the text.  
* 2.4 The draft had placeholders like `[featured-hotels]` in the content (perhaps under a section “Where to Stay”). The editor sees a preview of this block (maybe a grey box labeled “Featured Hotels will be inserted here”). If the editor is unhappy with it (maybe the article doesn’t need that section), they can remove the block. Conversely, if they want to add a related content block not already present, they use the editor to insert it (e.g. add “Related Tours” block).  
* 2.5 Images: The editor uploads any additional images to complement the text. For example, they add an image of a city skyline at the top. The image is uploaded to Bunny and embedded. They ensure each image has an alt text (the editor UI might flag if alt text is empty as a warning for SEO).  
* 2.6 Throughout editing, the article remains in Draft. The editor can save changes periodically. The system may autosave versions in the background.

**Step 3: Review & Approval**

* 3.1 Once content and SEO are satisfactory (SEO score perhaps turned “Green”), the editor clicks “Submit for Approval”. The article’s status changes to *Pending Review*. A notification or queue is updated for the admin.  
* 3.2 An admin (or designated reviewer) opens the article in the editor (possibly in a read-only mode or with edit rights). They read through, verify quality, and check for compliance (e.g. no policy violations, no obviously wrong info). They can toggle the SEO panel too – if they see critical SEO items were ignored, they might fix them or ask the editor to.  
* 3.3 If changes are needed, the admin adds comments (perhaps in a comment field or simply communicates offline) and marks the article as “Requires Edits” (reverting status to Draft or a separate status). The editor is notified and goes back to Step 2\.  
* 3.4 If everything looks good, the admin clicks Approve & Publish.

**Step 4: Publication & Post-Publish Actions**

* 4.1 On approval, the backend finalizes the content. This includes replacing any shortcodes with actual dynamic content from the database (the `[featured-hotels]` is replaced with HTML for the hotel list, etc.)​. It also ensures all internal links are proper anchor tags pointing to correct URLs, and that the meta title/description are set in the page metadata.  
* 4.2 The article status becomes *Published*. A public URL is generated (usually based on the title slug). This URL is saved in the article record. If using Next.js, the static site generation for that page can be triggered or if using SSR, it will be available on next request. We may call a rebuild process if the site is statically generated.  
* 4.3 The system updates the XML sitemap with the new URL and ping search engines (Google/Bing) to notify of new content (this helps quicker indexing). This can be done by a server-side service or plugin.  
* 4.4 Since internal linking is heavily used, we might also update related content. For example, if we have a list of “recent articles” or if other pages list related guides, the new article might appear there now that it’s published.  
* 4.5 The published article page will fetch any dynamic content fresh. E.g., when a user views the article, the page template might call APIs to get the latest hotel info for the embedded block (unless we baked the HTML in at publish time). We will likely bake it in at publish for simplicity and performance (with the option to regenerate that snippet periodically or on page rebuild).

**Step 5: Ongoing Optimization**

* 5.1 (Future/ongoing) The platform gathers data on published articles (page views, SEO ranking via Search Console, etc.). This isn’t immediate in the publishing flow, but over time, this data can inform improvements. For instance, if certain recommended internal links get a lot of clicks, the system learns to prioritize those. Or if an article isn’t performing, an editor might update it.  
* 5.2 The system allows updating published articles. If an editor opens a published article and edits it, perhaps it goes into an “Update Draft” state – or they edit live if minor. Usually, it might duplicate the article to a draft revision, then require approval again for major changes. This ensures changes can be reviewed as well.

The above flow could be drawn as a diagram with swimlanes for Editor, AI System, and Admin to visualize responsibilities. Each step corresponds to components we specified: the AI service, the editor interface, the SEO analysis module, the linking engine, and the publishing backend.

**8\. AI Content Validation & Moderation (Quality Control) Optional \- not needed for MVP**

Since we incorporate AI-generated content, it’s crucial to have validation steps to maintain quality and compliance:

* OpenAI Moderation API: We will use OpenAI’s Moderation endpoint (or similar if another AI) to automatically check the AI draft for any disallowed content (hate, sexual, violent, etc.)​ If the moderation flags the content, we will not present it directly to the editor; instead, we could either regenerate content or mark it for careful review. This ensures we don’t accidentally present problematic text to editors or allow it to slip through.  
* Plagiarism Check: Optionally, integrate a plagiarism detection API to ensure the AI hasn’t produced text too similar to existing web content. This might be a future enhancement, but it’s a consideration for content originality.  
* Factual Verification: While difficult to fully automate, for travel content we can utilize internal data to fact-check certain details. For example, if AI mentions a hotel’s name, we can verify that exists in our database. Or if AI states a statistic (like “Paris has X population”), perhaps integrate a secondary AI query or dataset to verify. At minimum, editors are expected to do a sanity check.  
* Template and Tone Consistency: The AI prompts will be crafted to produce content in a consistent tone and format (as described in the prompt instructions, e.g. including introduction, body with subheadings, conclusion, CTAs​  
  file-lpvgdwxtlq56g62bszsogz  
  ). We’ll validate that those sections exist (for instance, ensure there’s at least one subheading, etc.). The SEO tool covers some of this (like checking for headings).  
* Affiliate/Monetization Links: Ensure that wherever AI suggested a call-to-action, the appropriate affiliate link is in place. This might be manual – editors should insert or confirm affiliate links (like to Booking.com or Viator) in relevant places. We will provide a UI for linking those (maybe a prompt when linking externally to tag it as affiliate). Eventually, could automate adding affiliate IDs to certain known URLs.  
* Human Editorial Oversight: Ultimately, the platform positions AI as a helper, not an unsupervised publisher. The requirement that all AI content starts as Draft and needs human approval is the main quality gate. The editorial team should be trained to scrutinize AI outputs for accuracy and tone (especially in travel, to avoid misleading info). The interface will make this easy by highlighting AI sections and allowing quick edits.

Moderation Workflow: If the AI returns content that violates policies (e.g., it generated some inappropriate sentence), we could highlight that in red in the editor (if we still show it) and have a warning “This content may be inappropriate – please edit.” Or we might auto-remove it and notify the user to manually write that part. This depends on how strict the policies we adopt. Given travel content is generally benign, issues should be rare, but we will have this safeguard.

Version Control: Keep the original AI draft saved (perhaps as version 1). This way, if any issues arise later (e.g., someone claims content is copied), we have an audit trail of what AI provided versus what editors changed.

**9\. Scalability & Best Practices**

The design ensures the solution can scale as content and traffic grows:

* Node.js Backend: Use clustering or horizontal scaling to handle concurrent editor usage and publication. The heavy tasks (AI calls, image processing) are offloaded to external services (OpenAI, Bunny) or done asynchronously, so the Node server mainly orchestrates. We might use a job queue (like BullMQ or RabbitMQ) for AI generation tasks to manage load, especially if many articles are generated in batch. This prevents tying up HTTP request threads for long AI calls. The editor can poll for status or we use WebSocket to notify when draft is ready.  
* Database: We’ll ensure efficient queries for content suggestions (adding indexes on fields like location, tags). Using Supabase (Postgres) allows us to write SQL for complex joins (e.g. find hotels in X city) quickly. We should also consider caching results for frequently suggested content (e.g., top tours in Rome doesn’t change often; we can cache that daily).  
* CDN for assets and pages: All images go through Bunny CDN, taking load off our servers. For the pages, if using Next.js, we can leverage Incremental Static Generation such that published articles are served as static pages (very scalable). If not, at least enable caching on the frontend for published content (since content is mostly static once published).  
* SEO at Scale: The SEO analyzer running for every article edit is okay for a single article at a time, but if we had a bulk import of 100 articles, we shouldn’t run all at once on the server. In that case, a queued approach or performing analysis client-side would be better. The libraries mentioned (YoastSEO.js) actually run in the browser which offloads the server. So using that in the React app is a good scalable approach – dozens of editors can get SEO feedback without stressing the server. The server-side would only do heavy lifting when needed (or for verifying prior to publish).  
* Internal Linking Data: If the number of pages grows to thousands, scanning them for every article could be expensive. To scale, we might precompute a keyword-to-URL map. For example, maintain a search index (Elastic or even a simple inverted index in a table) so that for a given keyword we can quickly find relevant pages. This index can be updated whenever new content is added.  
* Microservices Consideration: In future, different pieces (AI generation, SEO analysis, image handling) could be split into microservices or serverless functions. For instance, an AWS Lambda or Vercel Function could handle image upload to Bunny (triggered by API). The architecture is initially monolithic for simplicity but can evolve.  
* Monitoring & Analytics: We’ll implement logging for the content creation process and monitor AI usage (to track costs). Also, track how often suggestions are used (e.g., are editors accepting the internal link suggestions? If not, maybe improve their relevance).

Security: Ensure the backend endpoints authenticate the user for every action (using JWT or session tokens from the dashboard login). Also validate inputs (for example, sanitize any HTML if the user enters custom HTML block to avoid XSS in preview). The advantage of our controlled editor is we can sanitize output upon save, or use a whitelist of allowed tags. This prevents an editor from injecting something malicious into the content either accidentally or intentionally. The published pages should only contain safe HTML (images, iframes from trusted sources like Maps, etc., and no script tags unless vetted).

**Tech Stack Summary:**

* Backend: Node.js (with a framework), connected to Postgres (Supabase). Possibly using an ORM or Supabase client for data. Also integrates with external APIs: OpenAI (for content), Bunny (for images), maybe Google Maps API (for geocoding if needed to get coordinates).  
* Frontend: React (could be Next.js for SSR). Using component libraries for UI (maybe Tailwind \+ ShadCN for aesthetics as mentioned in project doc). Rich text editor component as discussed (Editor.js/TipTap). State management could be simple (React context or Redux if needed for large state like the editor content).  
* The dashboard will be deployed likely on Vercel or similar, ensuring fast global access for editors. The backend could be serverless functions or a Node server on a VPS or cloud run. In any case, it should handle the concurrent usage of maybe dozens of editors across multiple sites.

By following this specification, we create an efficient content pipeline: from AI draft to human curation to SEO polishing to automated linking and finally to a published, SEO-optimized article. This reduces manual effort while maintaining quality, and sets up a system that can produce and manage potentially thousands of travel content pages with consistency and search-engine friendliness.

Sources: The design takes inspiration from existing tools and best practices, such as WordPress Gutenberg editor, RankMath SEO analysis, and LinkWhisper internal linking suggestions, adapting them into our custom Node/React stack for the VN travel platform. Key references include the feature set of SEOrd for SEO checks​.