import React, { useState } from "react";
import Link from "next/link";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import PageTitle from "@/components/PageTitle";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Pencil, 
  Trash2, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Eye, 
  ArrowUpDown 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data for articles
const mockArticles = [
  {
    id: "1",
    title: "Top 10 Places to Visit in Slovenia",
    author: "John Doe",
    category: "Travel",
    status: "published",
    date: "2025-02-20",
    views: 1245,
  },
  {
    id: "2",
    title: "The Best Slovenian Cuisine",
    author: "Jane Smith",
    category: "Food",
    status: "published",
    date: "2025-02-18",
    views: 987,
  },
  {
    id: "3",
    title: "Hiking in Triglav National Park",
    author: "Mike Johnson",
    category: "Adventure",
    status: "draft",
    date: "2025-02-15",
    views: 0,
  },
  {
    id: "4",
    title: "Ljubljana: The Hidden Gem of Europe",
    author: "Sarah Williams",
    category: "City Guide",
    status: "published",
    date: "2025-02-10",
    views: 2341,
  },
  {
    id: "5",
    title: "Winter Activities in Slovenia",
    author: "David Brown",
    category: "Seasonal",
    status: "scheduled",
    date: "2025-02-28",
    views: 0,
  },
];

const ArticlesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredArticles = mockArticles.filter((article) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];
    
    if (typeof fieldA === "string" && typeof fieldB === "string") {
      return sortDirection === "asc" 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    }
    
    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortDirection === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }
    
    return 0;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6" style={{ paddingTop: '25px' }}>
      <PageTitle title="Articles Management" description="Manage your blog articles and content" />
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Articles</h1>
          <p className="text-gray-500">Manage your blog articles</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/articles/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Article
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Articles</CardTitle>
          <CardDescription>
            View and manage all your blog articles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                All ({mockArticles.length})
              </Button>
              <Button variant="outline" size="sm">
                Published ({mockArticles.filter(a => a.status === "published").length})
              </Button>
              <Button variant="outline" size="sm">
                Drafts ({mockArticles.filter(a => a.status === "draft").length})
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[400px]">
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("title")}
                      className="flex items-center"
                    >
                      Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("author")}
                      className="flex items-center"
                    >
                      Author
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("category")}
                      className="flex items-center"
                    >
                      Category
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("status")}
                      className="flex items-center"
                    >
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("date")}
                      className="flex items-center"
                    >
                      Date
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      onClick={() => handleSort("views")}
                      className="flex items-center"
                    >
                      Views
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedArticles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No articles found
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedArticles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell className="font-medium">{article.title}</TableCell>
                      <TableCell>{article.author}</TableCell>
                      <TableCell>{article.category}</TableCell>
                      <TableCell>{getStatusBadge(article.status)}</TableCell>
                      <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                      <TableCell>{article.views.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticlesManagement;
