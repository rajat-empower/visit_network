import { useQuery } from "@tanstack/react-query";
// Remove Supabase import
// import { supabase } from "@/integrations/supabase/client";
// Import API utility
import { contactsAPI } from '@/utils/api';
import WeatherWidget from "@/components/WeatherWidget";
import { setupDatabase } from "@/utils/setupDatabase";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import SkeletonCard from "@/components/ui/skeleton-card";
import PageTitle from "@/components/PageTitle";

interface Contact {
  id: string;
  name: string;
  description: string;
}

const ContactUs = () => {
  const { data: contacts, isLoading, error } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      try {
        // Use the API utility instead of direct Supabase call
        const response = await contactsAPI.getContacts();
        
        if (response && typeof response === 'object' && 'data' in response) {
          const contactsData = response.data;
          
          if (!contactsData || !Array.isArray(contactsData) || contactsData.length === 0) {
            // If no data from API, return hardcoded data
            return [
              {
                id: '1001',
                name: 'John Doe',
                description: 'This is a sample description.',
              },
            ];
          }
          
          // Add additional information to each contact
          return contactsData.map(contact => ({ 
            id: contact.id, 
            name: contact.name, 
            description: contact.description 
          }));
        } else {
          // If invalid response format, return hardcoded data
          console.error('Invalid response format from API');
          return [
            {
              id: '1001',
              name: 'John Doe',
              description: 'This is a sample description.',
            },
          ];
        }
      } catch (err) {
        console.error("Error fetching contacts:", err);
        throw err;
      }
    },
  });

  if (error) {
    console.error("Query error:", error);
    return (
      <div className="min-h-screen bg-gray-50 pt-16">
        <PageTitle title="Contact Us" description="Get in touch with us" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Error Loading Contact Form</h1>
          <p className="text-red-500 mb-4">Failed to load contact form. Error details:</p>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <PageTitle title="Contact Us" description="Get in touch with us" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

        <div className="prose max-w-none mb-12">
          <p className="text-gray-600 leading-relaxed">
            Have a question or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Form */}
          <div className="lg:w-2/3">
            <form className="w-full max-w-4xl">
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                    Name
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-first-name" type="text" placeholder="Jane Doe" />
                </div>
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-last-name">
                    Email
                  </label>
                  <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-last-name" type="email" placeholder="jane.doe@example.com" />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                  <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                    Message
                  </label>
                  <textarea className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" placeholder="Your message..." />
                </div>
              </div>
              <div className="md:flex md:items-center">
                <button className="shadow bg-[#ea384c] hover:bg-[#d62d3f] focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button">
                  Send Message
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Weather Widget */}
            <WeatherWidget />

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <p className="text-[#888888] block">Address: 123 Main St, Anytown, USA</p>
                  </li>
                  <li>
                    <p className="text-[#888888] block">Phone: 555-555-5555</p>
                  </li>
                  <li>
                    <p className="text-[#888888] block">Email: <a href="mailto:info@example.com" className="text-[#ea384c] hover:text-[#d62d3f]">info@example.com</a></p>
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
