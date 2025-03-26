import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Tag } from "lucide-react";
import { slugify as createSlug } from "@/utils/slugify";

interface TourCardProps {
  tour: {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
    duration: string;
    booking_link?: string;
    tour_type_id?: string | null;
    tour_type_name?: string;
    cities?: {
      name: string;
    };
  };
}

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  return (
    <Card key={tour.id} className="overflow-hidden group shadow-sm">
      <div className="overflow-hidden">
        <img
          src={tour.image_url || '/placeholder.svg'}
          alt={tour.name}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl mb-2">{tour.name}</h3>
        <div className="flex gap-4 mb-4">
          <div className="flex items-center">
            <Clock size={16} className="text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">{tour.duration}</span>
          </div>
          <div className="flex items-center">
            <Tag size={16} className="text-[#ea384c] mr-2" />
            <span className="text-sm text-[#ea384c] font-bold">€{tour.price}</span>
          </div>
        </div>

        <div className="mb-4">
          {tour.tour_type_name && (
            <Link 
              href={`/tours?type=${tour.tour_type_id}${tour.cities && 'name' in tour.cities ? `&city=${encodeURIComponent(tour.cities.name)}` : ''}`}
              className="inline-block bg-gray-100 text-gray-600 px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
            >
              <Tag size={14} className="text-gray-500 mr-2 inline-block" />
              {tour.tour_type_name}
            </Link>
          )}
        </div>

        <p className="text-gray-600 mb-4 line-clamp-3">{tour.description}</p>
        <div className="flex justify-start">
          <Link
          href={`/tours/${createSlug(tour.name)}`}
            className="bg-[#ea384c] text-white px-4 py-2 rounded hover:bg-[#d62d3f] transition-colors"
          >
            
            More about this...
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourCard;
