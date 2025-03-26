"use client";

import Link from 'next/link';
import PageTitle from '../components/PageTitle';
import RecommendedActivities from '../components/RecommendedActivities';

export function Index() {
  return (
    <div className="min-h-screen">
      <PageTitle title="Home" description="Discover Slovenia - Your gateway to the hidden gems of Europe" />
      <div className="relative overflow-hidden">
        <img 
          src="/images/theme/welcome-to-slovenia.jpg"
          alt="Lake Bled Slovenia" 
          className="w-full h-300 object-cover animate-hero-pan"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
          <p className="h6">VISITSLOVENIA.COM</p>
            <h1 className="text-6xl font-bold mb-4">Discover Slovenia</h1>
            <p className="h3">Your gateway to the hidden gems of Europe</p>
            
          </div>
          
           
          
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Places to Stay</h3>
              <p className="text-gray-600 mb-4">Find the perfect accommodation for your Slovenian adventure</p>
              <Link href="/places-to-stay" className="text-blue-600 hover:text-blue-800">
                Explore more →
              </Link>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Travel Guides</h3>
              <p className="text-gray-600 mb-4">Expert tips and recommendations for your journey</p>
              <Link href="/travel-guides" className="text-blue-600 hover:text-blue-800">
                Explore more →
              </Link>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tours & Activities</h3>
              <p className="text-gray-600 mb-4">Unforgettable experiences and guided tours</p>
              <Link href="/tours" className="text-blue-600 hover:text-blue-800">
                Explore more →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Activities */}
      <RecommendedActivities />
      
      {/* Featured Places */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Places</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg shadow-sm group">
              <div className="overflow-hidden">
                <img 
                  src="https://visitslovenia.b-cdn.net/uploads/cities/ljubjana.jpg" 
                  alt="Ljubljana" 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Ljubljana</h3>
                <p className="text-gray-600 mb-4">Slovenia's charming capital, where history meets modern culture in a vibrant urban setting.</p>
                <Link href="/cities/ljubljana" className="text-blue-600 hover:text-blue-800">
                  Explore more →
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg shadow-sm group">
              <div className="overflow-hidden">
                <img 
                  src="https://visitslovenia.b-cdn.net/uploads/cities/piran.jpg" 
                  alt="Piran" 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Piran</h3>
                <p className="text-gray-600 mb-4">A picturesque coastal town with Venetian architecture and stunning Adriatic views.</p>
                <Link href="/cities/piran" className="text-blue-600 hover:text-blue-800">
                  Explore more →
                </Link>
              </div>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg shadow-sm group">
              <div className="overflow-hidden">
                <img 
                  src="https://visitslovenia.b-cdn.net/uploads/cities/lake-bled-slovenia.jpg" 
                  alt="Lake Bled" 
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-1"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Lake Bled</h3>
                <p className="text-gray-600 mb-4">An alpine lake with a fairytale island church and medieval castle on a clifftop.</p>
                <Link href="/cities/bled" className="text-blue-600 hover:text-blue-800">
                  Explore more →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};