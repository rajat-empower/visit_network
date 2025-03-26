"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Tours from "@/comp-pages/Tours";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

// Create a client component that uses searchParams
function ToursContent() {
  const searchParams = useSearchParams();
  
  // Parse query parameters
  const city = searchParams.get('city');
  const category = searchParams.get('category');
  
  return (
    <Tours 
      initialCity={city || undefined} 
      initialCategory={category || undefined}
      onTitleChange={(title) => {
        console.log("Title changed to:", title);
      }}
    />
  );
}

export default function ToursClientPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<div className="p-8 text-center">Loading tours...</div>}>
        <ToursContent />
      </Suspense>
    </QueryClientProvider>
  );
} 