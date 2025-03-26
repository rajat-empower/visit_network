"use client";

import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourDetailPage from "@/comp-pages/TourDetailPage";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

export default function TourDetail() {
  const params = useParams();
  const tourName = params.name as string;
  
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <TourDetailPage tourName={tourName} />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}