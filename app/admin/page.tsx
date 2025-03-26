'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/admin/article">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Manage Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create, edit, and delete articles</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/cities">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Manage Cities</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create, edit, and delete cities</p>
            </CardContent>
          </Card>
        </Link>
        
        <Link href="/admin/places">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle>Manage Places</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Create, edit, and delete places to stay</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
