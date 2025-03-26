"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CityDetails from "@/comp-pages/CityDetails";

export default function HomePage() {
  return  <div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <CityDetails />
  </main>
  <Footer />
  </div>;
}


