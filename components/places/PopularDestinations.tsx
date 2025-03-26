
import React from "react";
import Link from "next/link";

interface PopularDestinationsProps {
  cities: any[] | undefined;
}

export const PopularDestinations = ({ cities }: PopularDestinationsProps) => {
  return (
    <div className="mb-12">
      <h2 className="text-3xl font-bold mb-8">Places to Stay in Popular Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cities?.slice(0, 3).map((city) => (
          <Link key={city.id} href={`/cities/${city.name.toLowerCase()}`}>
            <div className="group relative h-64 overflow-hidden rounded-lg">
              <img
                src={city.image_url || '/placeholder.svg'}
                alt={city.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                width={400}
                height={256}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-2xl font-bold text-white">{city.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
