import React from "react";
import Link from "next/link";
import { Menu, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopbarProps {
  onMenuButtonClick: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onMenuButtonClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-10 z-10"> {/* Changed top-0 to top-10 to account for the GlobalTopbar */}
      <div className="flex items-center justify-between h-16 px-4">
        {/* Left side */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuButtonClick}
            className="mr-4"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Link href="/dashboard" className="text-xl font-bold text-[#ea384c]">
            VisitSlovenia.com
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ea384c] focus:border-transparent"
            />
          </div>

          {/* Quick links */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                <span>Create New</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/articles/new" className="w-full">
                  New Article
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/media/new" className="w-full">
                  Upload Media
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/pages/new" className="w-full">
                  New Page
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu placeholder - removed logo as requested */}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
