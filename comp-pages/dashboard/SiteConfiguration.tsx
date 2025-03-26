import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageTitle from "@/components/PageTitle";

const SiteConfiguration: React.FC = () => {
  return (
    <div className="space-y-6" style={{ paddingTop: '25px' }}>
      <PageTitle title="Site Configuration" description="Manage your website settings and configurations" />
      <div>
        <h1 className="text-2xl font-bold">Site Configuration</h1>
        <p className="text-gray-500">Manage your website settings and configurations</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="styling">Styling</TabsTrigger>
          <TabsTrigger value="api">API Settings</TabsTrigger>
        </TabsList>

        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure basic website settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="top-bar">Top Bar</Label>
                  <p className="text-sm text-gray-500">
                    Show or hide the top navigation bar
                  </p>
                </div>
                <Switch id="top-bar" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact-link">Contact Us Link</Label>
                <Input id="contact-link" placeholder="https://example.com/contact" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="copyright">Copyright Text</Label>
                <Input id="copyright" placeholder="© 2025 VisitSlovenia.com. All rights reserved." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>
                Configure your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" placeholder="https://facebook.com/yourusername" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" placeholder="https://instagram.com/yourusername" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" placeholder="https://twitter.com/yourusername" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input id="youtube" placeholder="https://youtube.com/yourchannel" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Currency Settings Tab */}
        <TabsContent value="currency" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Currency Settings</CardTitle>
              <CardDescription>
                Configure currency display options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="default-currency">Default Currency</Label>
                <Select defaultValue="eur">
                  <SelectTrigger id="default-currency">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">Euro (€)</SelectItem>
                    <SelectItem value="usd">US Dollar ($)</SelectItem>
                    <SelectItem value="gbp">British Pound (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency-position">Currency Symbol Position</Label>
                <Select defaultValue="before">
                  <SelectTrigger id="currency-position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="before">Before (€100)</SelectItem>
                    <SelectItem value="after">After (100€)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thousand-separator">Thousand Separator</Label>
                <Select defaultValue="comma">
                  <SelectTrigger id="thousand-separator">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comma">Comma (1,000)</SelectItem>
                    <SelectItem value="dot">Dot (1.000)</SelectItem>
                    <SelectItem value="space">Space (1 000)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Styling Tab */}
        <TabsContent value="styling" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Article Index Styling</CardTitle>
              <CardDescription>
                Configure how articles are displayed on index pages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="articles-per-page">Articles Per Page</Label>
                <Input id="articles-per-page" type="number" defaultValue="10" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="article-layout">Article Layout</Label>
                <Select defaultValue="grid">
                  <SelectTrigger id="article-layout">
                    <SelectValue placeholder="Select layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="masonry">Masonry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-featured-image">Show Featured Image</Label>
                  <p className="text-sm text-gray-500">
                    Display featured images in article listings
                  </p>
                </div>
                <Switch id="show-featured-image" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="show-excerpt">Show Excerpt</Label>
                  <p className="text-sm text-gray-500">
                    Display article excerpts in listings
                  </p>
                </div>
                <Switch id="show-excerpt" defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Settings Tab */}
        <TabsContent value="api" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>
                Configure external API integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google-api-key">Google API Key</Label>
                <Input id="google-api-key" type="password" placeholder="Enter your Google API key" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="chatgpt-key">ChatGPT API Key</Label>
                <Input id="chatgpt-key" type="password" placeholder="Enter your ChatGPT API key" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bunny-cdn-host">Bunny CDN Host</Label>
                <Input id="bunny-cdn-host" placeholder="cdn.yourdomain.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bunny-cdn-zone">Bunny CDN Storage Zone</Label>
                <Input id="bunny-cdn-zone" placeholder="your-storage-zone" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bunny-cdn-key">Bunny CDN Access Key</Label>
                <Input id="bunny-cdn-key" type="password" placeholder="Enter your Bunny CDN access key" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratehawk-key">RateHawk API Key</Label>
                <Input id="ratehawk-key" type="password" placeholder="Enter your RateHawk API key" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="viator-key">Viator API Key</Label>
                <Input id="viator-key" type="password" placeholder="Enter your Viator API key" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button variant="outline">Cancel</Button>
        <Button>Save Changes</Button>
      </div>
    </div>
  );
};

export default SiteConfiguration;
