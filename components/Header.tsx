"use client";

import React, { useState } from "react";
import Link from "next/link";
import SearchModal from "./SearchModal";
import { Menu, X, Search } from "lucide-react";

const Header = () => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <img 
                src="/images/theme/vslogo.png" 
                alt="VisitSLovenia.com" 
                className="h-8"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-[0.8rem]">
            <Link 
              href="/" 
              className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal leading-[40px] h-[40px] px-[10px] inline-block"
            >
              HOME
            </Link>
            <Link 
              href="/travel-guides" 
              className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal leading-[40px] h-[40px] px-[10px] inline-block"
            >
              TRAVEL GUIDES
            </Link>
            <Link 
              href="/places-to-stay" 
              className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal leading-[40px] h-[40px] px-[10px] inline-block"
            >
              PLACES TO STAY
            </Link>
            <Link 
              href="/tours" 
              className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal leading-[40px] h-[40px] px-[10px] inline-block"
            >
              TOURS
            </Link>
            <Link 
              href="/cities" 
              className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal leading-[40px] h-[40px] px-[10px] inline-block"
            >
              CITIES
            </Link>
            <Link 
              href="/contact-us" 
              className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal leading-[40px] h-[40px] px-[10px] inline-block"
            >
              CONTACT US
            </Link>
            <button 
              className="text-[#8e8e8e] hover:text-gray-900 leading-[40px] h-[40px] px-[10px]"
              onClick={() => {
                setIsSearchModalOpen(true);
              }}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-4">
            <button 
              className="text-[#8e8e8e] hover:text-gray-900"
              onClick={() => {
                setIsSearchModalOpen(true);
              }}
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>
            <button
              onClick={toggleMobileMenu}
              className="text-[#8e8e8e] hover:text-gray-900 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                HOME
              </Link>
              <Link 
                href="/travel-guides" 
                className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TRAVEL GUIDES
              </Link>
              <Link 
                href="/places-to-stay" 
                className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PLACES TO STAY
              </Link>
              <Link 
                href="/tours" 
                className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                TOURS
              </Link>
              <Link 
                href="/cities" 
                className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CITIES
              </Link>
              <Link 
                href="/contact-us" 
                className="text-[#8e8e8e] hover:text-gray-900 uppercase text-[15px] font-normal px-2 py-1"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CONTACT US
              </Link>
            </div>
          </nav>
        )}
      </div>
      <SearchModal isOpen={isSearchModalOpen} onClose={handleCloseSearchModal} />
    </header>
  );
};

export default Header;
