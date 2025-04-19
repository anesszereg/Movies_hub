import React, { useState, useEffect } from 'react';
import movieService from '../services/movieService';

const HeroSection = () => {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch featured movies for the hero section
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getNowPlayingMovies(1);
        setMovies(response.movies.slice(0, 5)); // Use only first 5 movies for the hero
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hero movies:', error);
        setLoading(false);
      }
    };
    
    fetchFeaturedMovies();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!movies || movies.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [movies]);

  const nextSlide = () => {
    if (!movies || movies.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    if (!movies || movies.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (loading || !movies || movies.length === 0) {
    return <div className="h-96 bg-secondary animate-pulse"></div>;
  }

  return (
    <section className="relative h-[500px] overflow-hidden">
      {movies.map((movie, index) => (
        <div 
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'
          }`}
        >
          <div  className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
          <img 
            src={movie.backdrop} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="bg-accent px-2 py-1 rounded text-sm">{movie.rating.toFixed(1)}</span>
              <span>{movie.year}</span>
              <span>{movie.genres.slice(0, 2).join(', ')}</span>
            </div>
            <p className="text-gray-300 max-w-2xl mb-6 line-clamp-2">{movie.description}</p>
            <div className="flex space-x-4">
              <button className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Now
              </button>
              <button className="border border-white hover:bg-white/10 text-white px-6 py-3 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to List
              </button>
            </div>
          </div>
        </div>
      ))}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-30">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-accent' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
