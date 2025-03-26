import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-6 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Site info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">VisitSlovenia.com</h2>
            <p className="text-gray-300 mb-4">
              Your ultimate guide to exploring the hidden gems and breathtaking 
              landscapes of Slovenia. Discover the perfect destinations for your 
              next adventure.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-blue-400 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-pink-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-blue-300 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
                className="text-white hover:text-red-500 transition-colors">
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Column 2: Tours & Tickets */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#ea384c]">Tours & Tickets</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/tours/categories/adventure" className="text-gray-300 hover:text-white transition-colors">
                  Adventure Tours
                </Link>
              </li>
              <li>
                <Link href="/tours/categories/cultural" className="text-gray-300 hover:text-white transition-colors">
                  Cultural Experiences
                </Link>
              </li>
              <li>
                <Link href="/tours/categories/food" className="text-gray-300 hover:text-white transition-colors">
                  Food & Wine Tours
                </Link>
              </li>
              <li>
                <Link href="/tours/categories/day-trips" className="text-gray-300 hover:text-white transition-colors">
                  Day Trips
                </Link>
              </li>
              <li>
                <Link href="/tours/categories/outdoor" className="text-gray-300 hover:text-white transition-colors">
                  Outdoor Activities
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-gray-300 hover:text-white transition-colors">
                  All Tours
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Places to Stay */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#ea384c]">Places to Stay</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/places-to-stay" className="text-gray-300 hover:text-white transition-colors">
                  All Accommodations
                </Link>
              </li>
              <li>
                <Link href="/places-to-stay?type=hotel" className="text-gray-300 hover:text-white transition-colors">
                  Hotels
                </Link>
              </li>
              <li>
                <Link href="/places-to-stay?type=apartment" className="text-gray-300 hover:text-white transition-colors">
                  Apartments
                </Link>
              </li>
              <li>
                <Link href="/places-to-stay?type=hostel" className="text-gray-300 hover:text-white transition-colors">
                  Hostels
                </Link>
              </li>
              <li>
                <Link href="/places-to-stay?type=guesthouse" className="text-gray-300 hover:text-white transition-colors">
                  Guesthouses
                </Link>
              </li>
              <li>
                <Link href="/places-to-stay?type=luxury" className="text-gray-300 hover:text-white transition-colors">
                  Luxury Stays
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Popular Destinations */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-[#ea384c]">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cities/ljubljana" className="text-gray-300 hover:text-white transition-colors">
                  Ljubljana
                </Link>
              </li>
              <li>
                <Link href="/cities/bled" className="text-gray-300 hover:text-white transition-colors">
                  Bled
                </Link>
              </li>
              <li>
                <Link href="/cities/piran" className="text-gray-300 hover:text-white transition-colors">
                  Piran
                </Link>
              </li>
              <li>
                <Link href="/cities/maribor" className="text-gray-300 hover:text-white transition-colors">
                  Maribor
                </Link>
              </li>
              <li>
                <Link href="/cities/kranjska-gora" className="text-gray-300 hover:text-white transition-colors">
                  Kranjska Gora
                </Link>
              </li>
              <li>
                <Link href="/cities" className="text-gray-300 hover:text-white transition-colors">
                  All Destinations
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom links */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="flex flex-wrap justify-center gap-6 mb-6">
            <Link href="/about-us" className="text-gray-300 hover:text-white transition-colors">
              About Us
            </Link>
            <Link href="/contact-us" className="text-gray-300 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/faq" className="text-gray-300 hover:text-white transition-colors">
              FAQ
            </Link>
          </div>
          <div className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} VisitSlovenia.com. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;