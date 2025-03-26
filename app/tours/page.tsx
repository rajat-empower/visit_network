// This is a server component (no "use client" directive)
import React from 'react';
import ToursClientPage from '@/components/pages/ToursClientPage';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Tours and Activities in Slovenia',
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ToursClientPage />
      </main>
      <Footer />
    </div>
  );
}