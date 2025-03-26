
import React from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Function to convert spaces to hyphens for URL
const formatNameForUrl = (name: string): string => {
  return name ? name.replace(/\s+/g, '-') : '';
};

interface RecommendedPlacesProps {
  places: any[] | undefined;
}

export const RecommendedPlaces = ({ places }: RecommendedPlacesProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Recommended Hotels and Apartments this Month</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places?.map((place) => (
          <div key={place.id} className="h-full group">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1 hover:scale-[1.02]">
              <Link href={`/places-to-stay/${formatNameForUrl(place.city?.name)}/${formatNameForUrl(place.name)}`}>
                <div className="overflow-hidden relative">
                  <img
                    src={place.image_url || '/placeholder.svg'}
                    alt={place.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1 hover:rotate-0"
                    style={{ transformOrigin: 'center center' }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <CardHeader className="flex-1">
                  <CardTitle className="flex justify-between items-start">
                    <span className="text-xl">{place.name}</span>
                    <span className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">4.5</span>
                    </span>
                  </CardTitle>
                </CardHeader>
              </Link>
              <CardContent>
                <div className="flex justify-between items-center">
                  <Link href={`/cities/${place.city?.name?.toLowerCase()}`} className="text-sm bg-[#ea384c] text-white px-3 py-1 rounded hover:bg-[#d62d3f] transition-colors">
                    {place.city?.name}
                  </Link>
                  <span className="font-semibold text-[#ea384c]">€{place.price_range}</span>
                </div>
                {place.type && (
                  <span className="text-sm text-gray-500 mt-2 block">{place.type.name}</span>
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
