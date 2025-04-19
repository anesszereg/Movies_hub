import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TrailerModal from './TrailerModal';

const MovieCard = ({ movie }) => {
  const [trailerOpen, setTrailerOpen] = useState(false);
  
  const openTrailer = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTrailerOpen(true);
  };
  
  return (
    <>
      <div className="block">
        <div className="group relative rounded-lg overflow-hidden bg-gray-800 transition-transform duration-300 hover:scale-105">
          <Link to={`/movie/${movie.id}`}>
            <img 
              src={movie.poster} 
              alt={movie.title} 
              className="w-full h-[320px] object-cover"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <Link to={`/movie/${movie.id}`}>
              <h3 className="text-white font-bold text-lg">{movie.title}</h3>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-accent">{movie.rating.toFixed(1)}</span>
                <span className="text-gray-300 text-sm">{movie.year}</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {movie.genres.slice(0, 2).map((genre, index) => (
                  <span key={index} className="text-xs bg-gray-700 text-white px-2 py-1 rounded">
                    {genre}
                  </span>
                ))}
              </div>
            </Link>
            <div className="flex space-x-2">
              <Link 
                to={`/movie/${movie.id}`}
                className="bg-accent hover:bg-accent/80 text-white flex-1 py-2 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Details
              </Link>
              <button 
                onClick={openTrailer}
                className="bg-red-600 hover:bg-red-700 text-white flex-1 py-2 rounded-full flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Trailer
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trailer Modal */}
      <TrailerModal 
        movieId={movie.id}
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
      />
    </>
  );
};

export default MovieCard;
