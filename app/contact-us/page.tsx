"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactUs from "@/comp-pages/ContactUs";

export default function HomePage() {
  return  <div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <ContactUs />
  </main>
  <Footer />
  </div>;
}


