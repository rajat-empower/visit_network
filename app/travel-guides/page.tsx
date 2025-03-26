"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TravelGuides from "@/comp-pages/TravelGuides";

export default function HomePage() {
  return  <div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <TravelGuides />
  </main>
  <Footer />
  </div>;
}


