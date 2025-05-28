import React, { useState, useEffect } from 'react';
import { Edit } from 'lucide-react';

const Navbar = ({ 
  location, 
  cluster, 
  cartCount, 
  onCartClick, 
  onHistoryClick,
  onLocationEdit, 
  onClusterEdit,
  onSearch
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Animated Background and Top Accent Line */}
      <div className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 opacity-10 animate-pulse"></div>
      
      <nav className={`
        sticky top-0 z-50 transition-all duration-500 ease-out min-h-[4rem]
        ${isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-orange-100' 
          : 'bg-gradient-to-r from-orange-50 via-white to-orange-50'
        }
      `}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 animate-gradient-x"></div>
        
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between h-16">
            {/* Left Section - Logo and Location */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <div className="relative group shrink-0">
                <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-lg blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
                <div className="relative flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center transform hover:rotate-12 transition-all duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                    </svg>
                  </div>
                  <span className="text-2xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    FoodExpress
                  </span>
                </div>
              </div>

              {/* Location and Cluster Pills */}
              {location && (
                <div className="hidden lg:flex items-center space-x-4">
                  {/* Location Pill */}
                  <button 
                    onClick={onLocationEdit}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-orange-50 to-red-50 rounded-full border border-orange-200/50 hover:border-orange-300/50 transition-all duration-300"
                  >
                    {/* location icon */}  
                    <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-gray-700 font-medium">{location}</span>
                    <Edit className="w-3 h-3 text-gray-500" />
                  </button>

                  {/* Cluster Pill */}
                  {cluster && (
                    <div className="flex items-center group">
                      <button 
                        onClick={onClusterEdit}
                        className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-red-50 to-orange-50 rounded-full border border-red-200/50 hover:border-red-300/50 transition-all duration-300"
                      >
                        {/* cluster icon */}
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span className="text-gray-700 font-medium">{cluster.name}</span>
                        <Edit className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-3">
              {/* History Button */}
              <button 
                onClick={onHistoryClick}
                onMouseEnter={() => setHoveredButton('history')}
                onMouseLeave={() => setHoveredButton(null)}
                className="hidden md:flex relative group items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-orange-100 to-red-100 hover:from-orange-200 hover:to-red-200 transition-all duration-300 transform hover:scale-110 hover:rotate-3"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-0 group-hover:opacity-20 blur transition duration-300"></div>
                <svg className="w-6 h-6 text-orange-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {hoveredButton === 'history' && (
                  <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                    Order History
                  </div>
                )}
              </button>
              
              {/* Login Button */}
              <button 
                onMouseEnter={() => setHoveredButton('login')}
                onMouseLeave={() => setHoveredButton(null)}
                className="hidden md:block relative group px-6 py-2.5 rounded-full font-semibold text-orange-600 hover:text-white transition-all duration-300 transform hover:scale-105 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-100 to-red-100 group-hover:opacity-0 transition-opacity duration-300"></div>
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-10 group-hover:animate-pulse"></div>
              </button>
              
              {/* Sign Up Button */}
              <button 
                onMouseEnter={() => setHoveredButton('signup')}
                onMouseLeave={() => setHoveredButton(null)}
                className="hidden md:block relative group px-6 py-2.5 rounded-full font-bold text-white overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 group-hover:from-orange-600 group-hover:to-red-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 animate-pulse"></div>
                <span className="relative z-10">Sign Up</span>
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-red-400 rounded-full opacity-0 group-hover:opacity-30 blur transition duration-500"></div>
              </button>
              
              {/* Cart Button */}
              <button 
                onClick={onCartClick}
                onMouseEnter={() => setHoveredButton('cart')}
                onMouseLeave={() => setHoveredButton(null)}
                className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-colors duration-300"
              >
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                
                {cartCount > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center">
                    {cartCount}
                  </div>
                )}
                
                {hoveredButton === 'cart' && (
                  <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;