import React from "react";
import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import WeatherWidget from "@/components/WeatherWidget";
import Link from "next/link";

const ContactUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageTitle title="Contact Us" />
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white shadow-sm">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-[#ea384c]/10 flex items-center justify-center mb-4">
                    <MapPin className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Our Location</h3>
                  <p className="text-gray-500 text-sm">Ljubljana, Slovenia</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-[#ea384c]/10 flex items-center justify-center mb-4">
                    <Phone className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Phone Number</h3>
                  <p className="text-gray-500 text-sm">+386 1 234 5678</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white shadow-sm">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="w-12 h-12 rounded-full bg-[#ea384c]/10 flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-[#ea384c]" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Email Address</h3>
                  <p className="text-gray-500 text-sm">info@visitslovenia.com</p>
                </CardContent>
              </Card>
            </div>
            
            <Card className="bg-white shadow-sm mb-8">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Have a question or just want to say hello? We'd love to hear from you.
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:w-1/4 space-y-8">
            <WeatherWidget />
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Travel Guides</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <Link href="/travel-guides/best-time-to-visit-slovenia" className="text-[#888888] hover:text-[#ea384c] block">
                      Best Time to Visit Slovenia: Seasonal Guide
                    </Link>
                  </li>
                  <li>
                    <Link href="/travel-guides/top-attractions-slovenia" className="text-[#888888] hover:text-[#ea384c] block">
                      Top 10 Must-See Attractions in Slovenia
                    </Link>
                  </li>
                  <li>
                    <Link href="/travel-guides/transportation-guide-slovenia" className="text-[#888888] hover:text-[#ea384c] block">
                      Transportation Guide: Getting Around Slovenia
                    </Link>
                  </li>
                  <li>
                    <Link href="/travel-guides/hidden-gems-slovenia" className="text-[#888888] hover:text-[#ea384c] block">
                      Slovenia's Hidden Gems: Off the Beaten Path
                    </Link>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
