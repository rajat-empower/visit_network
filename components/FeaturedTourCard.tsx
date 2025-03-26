import React from 'react';
import Link from 'next/link';
import { slugify } from '../utils/slugify';

interface FeaturedTourCardProps {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: number;
  city: string;
  rating?: number;
  is_featured?: boolean;
}

const FeaturedTourCard: React.FC<FeaturedTourCardProps> = ({
  id,
  name,
  description,
  image_url,
  price,
  city,
  rating = 0,
  is_featured = true
}) => {
  // Generate star rating elements
  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span 
          key={i} 
          className={`text-xl ${i < rating ? 'text-[#ea384c]' : 'text-gray-300'}`}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="rounded-lg overflow-hidden shadow-lg group relative">
      {/* Featured Ribbon */}
      {is_featured && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#ea384c',
            color: 'white',
            padding: '4px 12px',
            fontSize: '10px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            zIndex: 10,
            transform: 'rotate(-45deg) translateX(-28%) translateY(-10%)',
            transformOrigin: 'top left',
            boxShadow: '0 3px 10px -5px rgba(0, 0, 0, 1)'
          }}
        >
          FEATURED
        </div>
      )}
      
      {/* Image Container */}
      <div className="overflow-hidden">
        <img 
          src={image_url} 
          alt={name} 
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-125 group-hover:rotate-3 group-hover:shadow-lg"
        />
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-[#ea384c] mb-1 line-clamp-2">
          <Link href={`/tours/${slugify(name)}?id=${id}`}>
            {name}
          </Link>
        </h3>
        <p className="text-gray-600 mb-2">{city}</p>
        
        {/* Description */}
        <p className="text-gray-700 mb-3 line-clamp-2" title={description}>
          {description}
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="mr-2">Tour Rating</div>
          <div className="flex">{renderStars()}</div>
        </div>
        
        {/* Price */}
        <div className="text-right font-bold text-lg">€{price}</div>
        
        {/* Link */}
        <div className="mt-4">
          <Link
            href={`/tours/${slugify(name)}`}
            className="text-blue-600 hover:text-blue-800"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTourCard;
