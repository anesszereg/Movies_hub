import React from 'react';

const Header = () => {
  return (
    <header className="bg-primary text-white py-4 px-6 md:px-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="text-2xl font-bold text-accent">StreamVibe</div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-accent">Home</a>
            <a href="#" className="hover:text-accent">Movies</a>
            <a href="#" className="hover:text-accent">TV Shows</a>
            <a href="#" className="hover:text-accent">Categories</a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-secondary text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-full">Sign In</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
