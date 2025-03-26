"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cities from "@/comp-pages/Cities";

export default function HomePage() {
  return  <div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <Cities />
  </main>
  <Footer />
  </div>;
}


