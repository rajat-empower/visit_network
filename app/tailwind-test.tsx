"use client";

import React from 'react';
import Link from 'next/link';

export default function TailwindTest() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Tailwind CSS Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {/* Testing backgrounds */}
        <div className="p-6 rounded-lg bg-black text-white">bg-black</div>
        <div className="p-6 rounded-lg bg-red-500 text-white">bg-red-500</div>
        <div className="p-6 rounded-lg bg-blue-500 text-white">bg-blue-500</div>
        
        {/* Testing opacity */}
        <div className="p-6 rounded-lg bg-black bg-opacity-75 text-white">bg-opacity-75</div>
        <div className="p-6 rounded-lg bg-black bg-opacity-50 text-white">bg-opacity-50</div>
        <div className="p-6 rounded-lg bg-black bg-opacity-25 text-white">bg-opacity-25</div>
        
        {/* Testing text */}
        <div className="p-6 rounded-lg border">
          <p className="text-xl font-bold text-green-600">Text Green 600</p>
          <p className="text-lg font-semibold text-purple-500">Text Purple 500</p>
          <p className="text-base font-medium text-gray-700">Text Gray 700</p>
        </div>
        
        {/* Testing flex */}
        <div className="p-6 rounded-lg border flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-medium">Flex Test</span>
            <span className="bg-gray-200 px-2 py-1 rounded">Item</span>
          </div>
          <div className="flex justify-center items-center h-16 bg-gray-100">
            <span>Centered Content</span>
          </div>
        </div>
        
        {/* Testing shadows and hover effects */}
        <div className="p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          Hover for deeper shadow
        </div>
      </div>
      
      <Link href="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
        Back to Home
      </Link>
    </div>
  );
} 