"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HotelDetailPage from "@/comp-pages/HotelDetailPage";

export default function HomePage() {
  return  <div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <HotelDetailPage />
  </main>
  <Footer />
  </div>;
}


