import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Image as Imagee,
  FileText,
  Bot,
  BookOpen,
  Settings,
  Code,
  Bed,
  Ticket,
  Search,
  Users,
  Wrench,
  Menu as MenuIcon,
  MapPin,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  isOpen: boolean;
}

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  isExternal?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "Media": true,
    "Pages": true,
    "AI Content Manager": true,
    "Articles": true,
    "Site Configuration": true,
    "Places to Stay": true,
    "Tours and Tickets": true,
    "SEO Settings": true,
    "Locations": true,
  });

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const menuItems: MenuItem[] = [
    {
      title: "Dashboard",
      icon: <Home className="h-5 w-5" />,
      path: "/dashboard",
    },
    {
      title: "Locations",
      icon: <MapPin className="h-5 w-5" />,
      children: [
        { 
          title: "Manage Locations", 
          icon: <ChevronRight className="h-4 w-4" />, 
          path: "/dashboard/locations"
        },
      ],
    },
    {
      title: "Media",
      icon: <Imagee className="h-5 w-5" 
      />,
      children: [
        { title: "Library", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/media/library" },
        { title: "Add New Media File", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/media/new" },
      ],
    },
    {
      title: "Pages",
      icon: <FileText className="h-5 w-5" />,
      children: [
        { title: "All Pages", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/pages" },
        { title: "Add New Page", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/pages/new" },
      ],
    },
    {
      title: "AI Content Manager",
      icon: <Bot className="h-5 w-5" />,
      children: [
        { title: "Create New Content", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/ai/create" },
        { title: "Modify Programmatic Content", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/ai/modify" },
      ],
    },
    {
      title: "Articles",
      icon: <BookOpen className="h-5 w-5" />,
      children: [
        { title: "All Articles", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/articles" },
        { title: "Add New Article", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/articles/new" },
        { title: "Categories", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/articles/categories" },
        { title: "Tags", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/articles/tags" },
        { title: "Reorder", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/articles/reorder" },
      ],
    },
    {
      title: "Site Configuration",
      icon: <Settings className="h-5 w-5" />,
      children: [
        { title: "Settings", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/config/settings" },
        { title: "Socials", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/config/socials" },
        { title: "Currency", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/config/currency" },
        { title: "API Settings", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/config/api" },
      ],
    },
    {
      title: "Custom CSS",
      icon: <Code className="h-5 w-5" />,
      path: "/dashboard/custom-css",
    },
    {
      title: "Places to Stay",
      icon: <Bed className="h-5 w-5" />,
      children: [
        { title: "All Places to Stay", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/places" },
        { title: "Facilities", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/places/facilities" },
        { title: "Types", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/places/types" },
        { title: "Importer", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/places/importer" },
        { title: "Featured Places", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/places/featured" },
        { title: "Settings", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/places/settings" },
      ],
    },
    {
      title: "Tours and Tickets",
      icon: <Ticket className="h-5 w-5" />,
      children: [
        { title: "All Tours and Tickets", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/tours" },
        { title: "Add New", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/tours/new" },
        { title: "Categories", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/tours/categories" },
        { title: "Importer", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/tours/importer" },
        { title: "Featured Content", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/tours/featured" },
        { title: "Settings", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/tours/settings" },
      ],
    },
    {
      title: "SEO Settings",
      icon: <Search className="h-5 w-5" />,
      children: [
        { title: "Analytics", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/seo/analytics" },
        { title: "Settings", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/seo/settings" },
        { title: "SiteMaps", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/seo/sitemaps" },
        { title: "Title and Meta", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/seo/meta" },
        { title: "SEO Analyser", icon: <ChevronRight className="h-4 w-4" />, path: "/dashboard/seo/analyser" },
      ],
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      path: "/dashboard/users",
    },
    {
      title: "Tools",
      icon: <Wrench className="h-5 w-5" />,
      path: "/dashboard/tools",
    },
    {
      title: "Menus",
      icon: <MenuIcon className="h-5 w-5" />,
      path: "/dashboard/menus",
    },
  ];

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isActive = item.path === location;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.title];

    // Only show top-level items when sidebar is collapsed
    if (!isOpen && depth > 0) return null;

    // For external links
    if (item.path && item.isExternal) {
      return (
        <div key={item.title} className={cn("mb-1", depth > 0 && "ml-4")}>
          <a
            href={item.path}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
              "text-gray-700 hover:bg-gray-100"
            )}
            title={item.title}
          >
            <span className={cn("flex-shrink-0", isOpen ? "mr-3" : "")}>{item.icon}</span>
            {isOpen && <span>{item.title}</span>}
          </a>
        </div>
      );
    }

    return (
      <div key={item.title} className={cn("mb-1", depth > 0 && "ml-4")}>
        {item.path ? (
          <Link
            href={item.path}
            className={cn(
              "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-[#ea384c]/10 text-[#ea384c]"
                : "text-gray-700 hover:bg-gray-100"
            )}
            title={item.title}
          >
            <span className={cn("flex-shrink-0", isOpen ? "mr-3" : "")}>{item.icon}</span>
            {isOpen && <span>{item.title}</span>}
          </Link>
        ) : (
          <button
            onClick={() => toggleExpand(item.title)}
            className={cn(
              "flex items-center justify-between w-full py-2 px-3 rounded-md text-sm font-medium transition-colors",
              isActive
                ? "bg-[#ea384c]/10 text-[#ea384c]"
                : "text-gray-700 hover:bg-gray-100"
            )}
            title={item.title}
          >
            <div className="flex items-center">
              <span className={cn("flex-shrink-0", isOpen ? "mr-3" : "")}>{item.icon}</span>
              {isOpen && <span>{item.title}</span>}
            </div>
            {isOpen && hasChildren && (
              <span>
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </button>
        )}
        {isOpen && hasChildren && isExpanded && (
          <div className="mt-1">
            {item.children!.map((child) => renderMenuItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-16" // Changed from "w-0 -ml-64" to "w-16" to keep a small portion visible
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center">
            {isOpen && <span className="text-lg font-bold text-[#ea384c]">Admin Dashboard</span>}
            {!isOpen && <span className="text-lg font-bold text-[#ea384c]">A</span>}
          </Link>
        </div>
        <ScrollArea className="flex-1 py-2">
          <div className="px-3">
            {menuItems.map((item) => renderMenuItem(item))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Sidebar;
