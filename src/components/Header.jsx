import React, { useState, useEffect, useRef } from 'react';
import { multiSearch } from '../services/movieService';

const Header = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [activeNavItem, setActiveNavItem] = useState('Home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // If search query is provided to parent component
    if (onSearch) {
      onSearch(query);
    }
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch();
    }
  };

  // Perform search against TMDB API
  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setIsSearching(true);
      const response = await multiSearch(searchQuery);
      setSearchResults(response.results.slice(0, 5)); // Limit to top 5 results
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length > 2) {
        performSearch();
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Movies', href: '#now_playing' },
    { name: 'TV Shows', href: '#popular' },
    { name: 'Categories', href: '#top_rated' }
  ];

  return (
    <header className="bg-primary text-white py-4 px-6 md:px-12 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <a href="#" className="text-2xl font-bold text-accent">StreamVibe</a>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className={`hover:text-accent transition-colors ${activeNavItem === item.name ? 'text-accent' : ''}`}
                onClick={() => setActiveNavItem(item.name)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Search movies, TV shows..." 
                className="bg-secondary text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-accent w-64"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
            
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute mt-2 w-full bg-secondary rounded-md shadow-lg overflow-hidden z-50">
                {isSearching ? (
                  <div className="p-4 text-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-accent mx-auto"></div>
                  </div>
                ) : (
                  <ul>
                    {searchResults.map((result) => (
                      <li key={`${result.mediaType}-${result.id}`} className="border-b border-gray-700 last:border-b-0">
                        <a 
                          href={`#${result.mediaType === 'movie' ? 'movie' : 'tv'}-${result.id}`}
                          className="block p-3 hover:bg-gray-700 transition-colors"
                          onClick={() => setSearchResults([])}
                        >
                          <div className="flex items-center">
                            {result.poster || result.profile ? (
                              <img 
                                src={result.poster || result.profile} 
                                alt={result.title || result.name} 
                                className="w-10 h-14 object-cover rounded mr-3"
                              />
                            ) : (
                              <div className="w-10 h-14 bg-gray-800 rounded mr-3 flex items-center justify-center">
                                <span className="text-xs">No image</span>
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{result.title || result.name}</p>
                              <p className="text-xs text-gray-400">
                                {result.mediaType === 'movie' ? 'Movie' : 
                                 result.mediaType === 'tv' ? 'TV Show' : 'Person'}
                                {result.year && ` • ${result.year}`}
                              </p>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                    <li className="border-t border-gray-700">
                      <a 
                        href="#search-all"
                        className="block p-2 text-center text-accent hover:bg-gray-700 transition-colors text-sm"
                        onClick={() => {
                          if (onSearch) onSearch(searchQuery);
                          setSearchResults([]);
                        }}
                      >
                        View all results
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
          
          {/* Mobile Search Button */}
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Sign In Button */}
          <button className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-full transition-colors">
            Sign In
          </button>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <div className="relative mb-4">
            <form onSubmit={handleSearchSubmit}>
              <input 
                type="text" 
                placeholder="Search movies, TV shows..." 
                className="bg-secondary text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-accent w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className={`hover:text-accent transition-colors ${activeNavItem === item.name ? 'text-accent' : ''}`}
                onClick={() => {
                  setActiveNavItem(item.name);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
