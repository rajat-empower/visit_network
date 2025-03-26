'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import PageTitle from '@/components/PageTitle';
import TourCard from '@/components/TourCard';
import { Search } from "lucide-react";
import Sidebar from "@/components/common/Sidebar";
import ArticleList from '@/components/ArticleList';

interface Tour {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: number;
    duration: string;
    booking_link: string;
    city_id: string;
    tour_type_id: string | null;
    cities: {
        name: string;
    };
    rating?: number;
}

interface Article {
    id: string;
    title: string;
    content: string;
    feature_img?: string;
    author?: string;
    tags?: string;
    created_at?: string;
    category?: {
        uuid: number;
        category: string;
    }[];
    slug?: string;
    excerpt?: string;
}

const SearchResults = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('q') || '';

    const [tours, setTours] = useState<Tour[]>([]);
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'tours' | 'places' | 'articles'>('tours');
    const [travelGuides, setTravelGuides] = useState<Article[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch search results');
                }

                const data = await response.json();

                if (data.tours) {
                    setTours(data.tours);
                }

                if (data.articles) {
                    setArticles(data.articles);
                }

                if (data.travelGuides) {
                    setTravelGuides(data.travelGuides);
                }
            } catch (error) {
                console.error('Error fetching search data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchQuery]);

    const handleSearch = (newQuery: string) => {
        window.location.href = `/search?q=${encodeURIComponent(newQuery)}`;
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-16">
            <PageTitle title={`Search results for "${searchQuery}"`} />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-[#ea384c]">Search results for "{searchQuery}"</h1>
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div className="relative w-full md:w-1/2 flex-grow">
                        <input
                            type="text"
                            placeholder="Search by name or keyword"
                            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ea384c] focus:border-transparent"
                            defaultValue={searchQuery}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSearch((e.target as HTMLInputElement).value);
                                }
                            }}
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="flex space-x-4 mb-4">
                            <button
                                className={`py-2 px-4 rounded-full text-sm ${activeTab === 'tours' ? 'bg-[#ea384c] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => setActiveTab('tours')}
                            >
                                Tours
                            </button>
                            <button
                                className={`py-2 px-4 rounded-full text-sm ${activeTab === 'places' ? 'bg-[#ea384c] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => setActiveTab('places')}
                            >
                                Places to Stay
                            </button>
                            <button
                                className={`py-2 px-4 rounded-full text-sm ${activeTab === 'articles' ? 'bg-[#ea384c] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                onClick={() => setActiveTab('articles')}
                            >
                                Articles
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#ea384c]"></div>
                            </div>
                        ) : (
                            <div>
                                {activeTab === 'tours' && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {tours.length > 0 ? (
                                            tours.map((tour) => (
                                                <TourCard
                                                    key={tour.id}
                                                    tour={{
                                                        ...tour,
                                                        cities: typeof tour.cities === 'object' ? tour.cities : { name: '' }
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 col-span-3">
                                                <h1 className="text-2xl font-bold mb-4">No Tours Found</h1>
                                                <p className="mb-6">We couldn't find any tours matching your search.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {activeTab === 'places' && (
                                    <div className="text-center py-12">
                                        <h1 className="text-2xl font-bold mb-4">Places to Stay</h1>
                                        <p className="mb-6">This section is under construction.</p>
                                    </div>
                                )}
                                {activeTab === 'articles' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {articles.length > 0 ? (
                                            articles.map((article) => (
                                                <ArticleList key={article.id} article={article} />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 col-span-full">
                                                <h1 className="text-2xl font-bold mb-4">No Articles Found</h1>
                                                <p className="mb-6">We couldn't find any articles matching your search.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <Sidebar showWeatherWidget={true} showTourCategories={true} showTravelGuides={true} />
                </div>
            </div>
        </div>
    );
};

export default SearchResults; 