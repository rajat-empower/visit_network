This document is to ensure that LLMs can understand the context of the project. It is to help a new LLM to follow the context of the project. Before starting a new task please follow this logic. 

\# Project Overview  
You can refer to the more detailed document in the docs folder called project-doc.md. In short, we are building a custom travel engine that will be used to build and manage websites for any country, city or region, or collection of locations. It will be used to publish travel content that will be monetised with affiliate links. It will create sites that will use a programmatic approach with best practice SEO techniques. We populate each site with content pulled from 3rd party APIs. For example, Viator.com and RateHawk.com. Each site is enhanced with travel guides in the form of articles that are generated using AI tools combined with a custom knowledge based made up of the content pulled from the 3rd party sources. 

\# Key Components  
Tours and Tickets \- pages of content using a standard format with data collected from the Viator.com API. We enhance this content with additional sources using generative AI.   
Places to Stay \- we use a ratehawk.com API to populate pages with details of hotels, apartments and other accommodation types. We show the user details of each property and provide a link that opens a new window where they can complete a booking. We are adding an AI driven tool that searches for the same property on other 3rd party sites so we can offer a price comparison feature. All external links will include our affiliate ID. 

\# Contextual Information  
We are creating a new engine using this tech stack;  
 \*\*Frontend:\*\* React (Vite) \+ Tailwind CSS \+ Shadcn UI  
\- \*\*Backend:\*\* Supabase (Database & Authentication)  
\- \*\*Deployment:\*\* Netlify \+ Supabase Hosting

Please note the environment variables we use to connect to supabase. Make sure to always refer to these when performing tasks related to the database. 

https://ufgcupjjxgxghlhgdlie.supabase.co  
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZ2N1cGpqeGd4Z2hsaGdkbGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkyOTg3NzAsImV4cCI6MjA1NDg3NDc3MH0.Oe2Lb17ea3RUo0hkmMZAvgnXT7Wi\_nnCGHmZYhuIIAM

\# Usage Instructions  
When asked to perform tasks please use these instructions. Ensure you can interact with the supabase database mentioned above. Check to ensure you have understood the project documents in the /docs folder for context. Keep the UI of both the front end and the dashboard as consistent as possible. Do not create any new layouts unless instructed. Use elements that already exist such as templates that include a sidebar \[ensure the width is always the same when a sidebar is used\]. For the dashboard use consistent styling for page layout, table structures, fields and buttons. 

Do not create any new tables in the database. Instead, suggest when a new table might be needed and provide instructions to have this done manually. Never create a script to create a table.

Never add any fallback for when you can't get data from a database table. 

We are going to have dynamic sidebars. Create sidebar code as a separate template that can be referenced from every page that needs a sidebar. Later, in our admin we will have a sidebar manager where we can create sidebars and assign these to any page, or any category. 