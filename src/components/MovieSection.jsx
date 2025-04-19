import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import movieService from '../services/movieService';

const MovieSection = ({ title, subtitle, category }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  // Fetch movies for the current page
  useEffect(() => {
    const fetchMoviesForPage = async () => {
      try {
        setLoading(true);
        let result;
        
        // Call the appropriate API method based on category
        switch (category) {
          case 'now_playing':
            result = await movieService.getNowPlayingMovies(currentPage);
            break;
          case 'popular':
            result = await movieService.getPopularMovies(currentPage);
            break;
          case 'top_rated':
            result = await movieService.getTopRatedMovies(currentPage);
            break;
          case 'upcoming':
            result = await movieService.getUpcomingMovies(currentPage);
            break;
          default:
            result = await movieService.getNowPlayingMovies(currentPage);
        }
        
        setMovies(result.movies);
        setTotalPages(result.totalPages);
        setLoading(false);
      } catch (err) {
        console.error(`Error fetching ${category} movies:`, err);
        setError(`Failed to load ${category} movies.`);
        setLoading(false);
      }
    };
    
    fetchMoviesForPage();
  }, [category, currentPage]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="px-6 md:px-12 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-block bg-accent text-white text-xs font-medium px-2 py-1 rounded mb-2">{subtitle}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        </div>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-6 md:px-12 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-block bg-accent text-white text-xs font-medium px-2 py-1 rounded mb-2">{subtitle}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        </div>
        <div className="text-center py-12 text-gray-400">{error}</div>
      </div>
    );
  }

  // Handle empty movie lists
  if (!movies || movies.length === 0) {
    return (
      <div className="px-6 md:px-12 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-block bg-accent text-white text-xs font-medium px-2 py-1 rounded mb-2">{subtitle}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
        </div>
        <div className="text-center py-12 text-gray-400">No movies available.</div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-12 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="inline-block bg-accent text-white text-xs font-medium px-2 py-1 rounded mb-2">{subtitle}</div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">Page {currentPage} of {totalPages}</div>
          <div className="flex space-x-2">
            <button 
              onClick={prevPage} 
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${currentPage === 1 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={nextPage} 
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${currentPage === totalPages ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default MovieSection;
