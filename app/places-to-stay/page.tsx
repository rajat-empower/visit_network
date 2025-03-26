"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PlacesToStay from "@/comp-pages/PlacesToStay";

export default function HomePage() {
  return  <div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <PlacesToStay />
  </main>
  <Footer />
</div>;
}