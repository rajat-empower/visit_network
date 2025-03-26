import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut, useRequireAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

const Dashboard = () => {
  const checkAuth = useRequireAuth();
  const navigate = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth().then(() => setIsLoading(false));
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate.push("/auth");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 py-[50px] px-[108px]">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-[#888888] hover:text-[#ea384c]">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>{'>'}</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-[#888888]">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Admin Tools</h2>
          <ul className="space-y-2">
            <li>
              <Link href="/admin/cities" className="text-blue-600 hover:text-blue-800 hover:underline">
                1. Manage Cities Table
              </Link>
            </li>
            <li>
              <Link href="/admin/places" className="text-blue-600 hover:text-blue-800 hover:underline">
                2. Manage Places to Stay
              </Link>
            </li>
            <li>
<Link href="/admin/article" className="text-blue-600 hover:text-blue-800 hover:underline">
                3. Create/Manage Articles
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
