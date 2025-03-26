"use client";

import { Index } from "@/comp-pages/Index";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function HomePage() {
  return  (<div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <Index />
  </main>
  <Footer />
</div>);
}