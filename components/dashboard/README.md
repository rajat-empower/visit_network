# Dashboard Implementation

This directory contains the components for the admin dashboard of VisitSlovenia.com.

## Structure

- `DashboardLayout.tsx`: The main layout component that includes the sidebar and topbar
- `Sidebar.tsx`: The sidebar navigation component with collapsible menu items
- `Topbar.tsx`: The top navigation bar with site name and quick actions

## Pages

The dashboard pages are located in `src/pages/dashboard/` and include:

- `DashboardHome.tsx`: The main dashboard page with statistics and quick actions
- `SiteConfiguration.tsx`: Settings page for configuring the website
- `ArticlesManagement.tsx`: Page for managing blog articles

## Usage

The dashboard is accessible at `/dashboard/v2` and uses React Router for navigation. The sidebar menu items are defined in `Sidebar.tsx` and can be customized as needed.

## Styling

The dashboard uses:
- Tailwind CSS for styling
- ShadCN UI components
- Lucide React icons

## Authentication

The dashboard requires authentication to access. Users are redirected to the login page if they are not authenticated.

## Adding New Pages

To add a new page to the dashboard:

1. Create a new component in `src/pages/dashboard/`
2. Add a route in `App.tsx` under the dashboard routes
3. Add a menu item in `Sidebar.tsx` if needed

## Future Improvements

- Add more page templates for all dashboard sections
- Implement data fetching from the API
- Add form validation for settings pages
- Implement user roles and permissions
