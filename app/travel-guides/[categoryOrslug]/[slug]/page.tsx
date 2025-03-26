"use client";


import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticlePage from "@/comp-pages/ArticlePage";

export default function HomePage() {
  return  <div className="flex min-h-screen flex-col">
  <Header />
  <main className="flex-1">
    <ArticlePage /> 
  </main>
  <Footer />
</div>;
}