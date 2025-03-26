import { Suspense } from 'react';
import SearchResults from '@/comp-pages/SearchResults';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Loading state component
function SearchLoading() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ea384c]"></div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<SearchLoading />}>
          <SearchResults />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}


