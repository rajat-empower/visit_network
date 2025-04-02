'use client';

import dynamic from 'next/dynamic';

const TourImporter = dynamic(() => import('@/comp-pages/dashboard/TourImporter'), {
  ssr: false
});

export default function TourImporterPage() {
  return <TourImporter />;
}
