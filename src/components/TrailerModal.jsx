import React, { useEffect, useState } from 'react';
import movieService from '../services/movieService';

const TrailerModal = ({ movieId, isOpen, onClose }) => {
  const [trailers, setTrailers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isOpen && movieId) {
      const fetchTrailers = async () => {
        try {
          setLoading(true);
          const videos = await movieService.getMovieVideos(movieId);
          setTrailers(videos);
          setLoading(false);
        } catch (err) {
          console.error('Error fetching trailers:', err);
          setError('Failed to load trailers.');
          setLoading(false);
        }
      };
      
      fetchTrailers();
    }
  }, [isOpen, movieId]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto py-8">
      <div className="bg-secondary rounded-lg w-full max-w-6xl relative min-h-[70vh] flex flex-col">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Modal content */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          {loading ? (
            <div className="flex justify-center items-center h-[80vh]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-gray-400 flex-1 flex items-center justify-center">{error}</div>
          ) : trailers.length === 0 ? (
            <div className="text-center py-20 text-gray-400 flex-1 flex items-center justify-center">No trailers available for this movie.</div>
          ) : (
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold mb-6 text-accent">Trailers & Videos</h2>
              <div className="aspect-w-16 aspect-h-9 md:h-[50vh] mb-6 bg-black rounded-lg overflow-hidden shadow-2xl">
                <iframe 
                  src={`https://www.youtube.com/embed/${trailers[0]?.key}?autoplay=1`}
                  title="Movie Trailer" 
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              {/* Additional trailers */}
              {trailers.length > 1 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">More Videos</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {trailers.slice(1, 4).map((trailer) => (
                      <div key={trailer.id} className="aspect-w-16 aspect-h-9">
                        <iframe 
                          src={`https://www.youtube.com/embed/${trailer.key}`}
                          title={trailer.name}
                          className="w-full h-full rounded-lg shadow-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrailerModal;
