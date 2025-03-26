import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { uploadPlaceImage } from "@/utils/images";
import PageTitle from "@/components/PageTitle";

interface Place {
  id: string;
  name: string;
  image_url: string | null;
  city: { name: string } | null;
  type: { name: string } | null;
}

const ManagePlaces = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/places');
      if (!response.ok) throw new Error('Failed to fetch places');
      const data = await response.json();
      setPlaces(data);
    } catch (error) {
      console.error('Error fetching places:', error);
      toast({
        title: "Error",
        description: "Failed to load places",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleImageUpload = async (placeId: string, file: File) => {
    try {
      setUploadingFor(placeId);
      const publicUrl = await uploadPlaceImage(placeId, file);
      
      if (publicUrl) {
        // Update the place in the database
        const response = await fetch('/api/places', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: placeId, image_url: publicUrl }),
        });

        if (!response.ok) throw new Error('Failed to update place');

        // Update the places state
        setPlaces(prevPlaces => 
          prevPlaces.map(place => 
            place.id === placeId 
              ? { ...place, image_url: publicUrl }
              : place
          )
        );
      }

      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error: any) {
      console.error('Error in handleImageUpload:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploadingFor(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <PageTitle title="Manage Places" description="Loading place data..." />
        <div className="animate-pulse text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FC] p-8 py-[55px] px-[107px]">
      <PageTitle title="Manage Places" description="Upload and manage place images" />
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/" className="text-gray-500 hover:text-primary transition-colors">
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/dashboard" className="text-gray-500 hover:text-primary transition-colors">
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink className="text-gray-500">
                    Manage Places
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="text-4xl font-bold text-gray-800 py-[4px]">Manage Places</h1>
            <p className="text-gray-500">Upload and manage place images</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">City</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Image</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {places.map(place => (
                <TableRow key={place.id} className="group hover:bg-gray-50/50">
                  <TableCell className="font-medium">{place.name}</TableCell>
                  <TableCell className="text-gray-600">{place.city?.name}</TableCell>
                  <TableCell className="text-gray-600">
                    <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {place.type?.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    {place.image_url ? (
                      <div className="relative group/image">
                        <img 
                          src={place.image_url} 
                          alt={place.name} 
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 group-hover/image:ring-2 group-hover/image:ring-primary/20 transition-all"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                          <Image className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center border border-dashed border-gray-300">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="relative">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(place.id, file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingFor === place.id}
                      />
                      <Button 
                        variant="outline" 
                        className="relative pointer-events-none"
                        disabled={uploadingFor === place.id}
                      >
                        {uploadingFor === place.id ? (
                          <span>Uploading...</span>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManagePlaces;
