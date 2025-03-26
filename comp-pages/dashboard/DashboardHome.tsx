import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  BookOpen, 
  Bed, 
  Ticket, 
  Users, 
  TrendingUp 
} from "lucide-react";
import PageTitle from "@/components/PageTitle";

const DashboardHome: React.FC = () => {
  // Mock data for dashboard stats
  const stats = [
    {
      title: "Total Articles",
      value: "24",
      icon: <BookOpen className="h-5 w-5 text-[#ea384c]" />,
      change: "+12% from last month",
    },
    {
      title: "Places to Stay",
      value: "48",
      icon: <Bed className="h-5 w-5 text-[#ea384c]" />,
      change: "+4% from last month",
    },
    {
      title: "Tours & Tickets",
      value: "36",
      icon: <Ticket className="h-5 w-5 text-[#ea384c]" />,
      change: "+8% from last month",
    },
    {
      title: "Total Users",
      value: "1,024",
      icon: <Users className="h-5 w-5 text-[#ea384c]" />,
      change: "+6% from last month",
    },
  ];

  return (
    <div className="space-y-6" style={{ paddingTop: '25px' }}>
      <PageTitle title="Dashboard" description="Visit Slovenia Dashboard - Overview and Analytics" />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Last updated: Today at 12:30 PM</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, i) => (
              <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium">New article published</h3>
                  <p className="text-xs text-gray-500">
                    "Top 10 Places to Visit in Slovenia" was published
                  </p>
                </div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="flex flex-col items-center text-center">
              <BarChart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium">Analytics Visualization</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Connect your analytics provider in the SEO settings to view traffic data here.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: "Add New Article", icon: <BookOpen className="h-5 w-5" />, path: "/dashboard/articles/new" },
                { title: "Upload Media", icon: <BookOpen className="h-5 w-5" />, path: "/dashboard/media/new" },
                { title: "Add New Place", icon: <Bed className="h-5 w-5" />, path: "/dashboard/places/new" },
                { title: "Add New Tour", icon: <Ticket className="h-5 w-5" />, path: "/dashboard/tours/new" },
              ].map((action, i) => (
                <button
                  key={i}
                  className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {action.icon}
                  <span className="mt-2 text-sm font-medium">{action.title}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
