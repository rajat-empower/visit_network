import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Plus } from "lucide-react";
import PageTitle from "../PageTitle";

// New GlobalTopbar component
const GlobalTopbar: React.FC = () => {
  return (
    <div className="bg-black text-white py-2 px-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center">
      <PageTitle title="Dashboard" />
      <Link href="/" className="text-white hover:text-gray-300 text-sm">
        Back to VisitSlovenia.com
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/articles/new"
          className="bg-[#ea384c] hover:bg-[#d02e3f] text-white text-sm py-1 px-3 rounded flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add New Article
        </Link>
      </div>
    </div>
  );
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      {/* Global fixed top bar */}
      <GlobalTopbar />

      <div className="flex h-screen bg-gray-100 pt-10"> {/* Added pt-10 to account for the fixed GlobalTopbar */}
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Bar */}
          <Topbar onMenuButtonClick={toggleSidebar} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
