import React, { useEffect, useRef } from 'react';

// Import Google Maps types
/// <reference types="@types/google.maps" />

interface GoogleMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  apiKey: string;
  className?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  latitude, 
  longitude, 
  zoom = 14, 
  apiKey,
  className = "w-full h-[400px] rounded-lg overflow-hidden mb-8"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Function to load the Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        // Script already loaded
        initializeMap();
        return;
      }

      // Create script element
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initGoogleMap`;
      script.async = true;
      script.defer = true;
      
      // Define callback function in global scope
      window.initGoogleMap = initializeMap;
      
      // Append script to document
      document.head.appendChild(script);
      
      return () => {
        // Clean up
        window.initGoogleMap = () => {};
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };

    // Function to initialize the map
    const initializeMap = () => {
      if (!mapRef.current) return;
      
      try {
        const mapOptions = {
          center: { lat: latitude, lng: longitude },
          zoom: zoom,
          mapTypeId: window.google?.maps?.MapTypeId?.ROADMAP,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
        };

        // Create new map instance
        const map = new window.google.maps.Map(mapRef.current, mapOptions);
        mapInstanceRef.current = map;

        // Add marker
        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          animation: window.google.maps.Animation.DROP
        });
      } catch (error) {
        console.error('Error initializing Google Map:', error);
      }
    };

    loadGoogleMapsScript();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        // No direct way to destroy a map instance, but we can clear the reference
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, apiKey]);

  return <div ref={mapRef} className={className} />;
};

// Add type declaration for the global window object
declare global {
  interface Window {
    initGoogleMap: () => void;
    google: any;
  }
}

export default GoogleMap;
