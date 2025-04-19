import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import movieService from '../services/movieService';
import TrailerModal from './TrailerModal';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cast, setCast] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [movieData, credits, reviewsData] = await Promise.all([
          movieService.getMovieDetails(id),
          movieService.getMovieCredits(id),
          movieService.getMovieReviews(id)
        ]);
        
        setMovie(movieData);
        setCast(credits.cast.slice(0, 8));
        setReviews(reviewsData.results.slice(0, 2));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center p-6 bg-secondary rounded-lg">
          <h3 className="text-xl font-bold text-accent mb-2">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/')} 
            className="mt-4 bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-full"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <>
      <div className="bg-primary text-white min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[500px]">
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-transparent z-10"></div>
          <img 
            src={movie.backdrop} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{movie.title}</h1>
            <p className="text-gray-300 max-w-3xl mb-6">{movie.tagline || movie.description.split('.')[0] + '.'}</p>
            <div className="flex space-x-4">
              <button 
                onClick={() => setTrailerOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Play Trailer
              </button>
              <button className="bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Movie
              </button>
              <button className="bg-transparent border border-white hover:bg-white/10 text-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button className="bg-transparent border border-white hover:bg-white/10 text-white p-3 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 md:px-12 py-10">
        {/* Left Column - Description */}
        <div className="md:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-300">{movie.description}</p>
          </div>

          {/* Cast Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">Cast</h3>
            <div className="flex overflow-x-auto space-x-4 pb-4">
              {cast.map((person) => (
                <div key={person.id} className="flex-shrink-0 w-24">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                    <img 
                      src={person.profile_path 
                        ? `https://image.tmdb.org/t/p/w200${person.profile_path}` 
                        : 'https://via.placeholder.com/200x200?text=No+Image'} 
                      alt={person.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center text-sm font-medium truncate">{person.name}</p>
                  <p className="text-center text-xs text-gray-400 truncate">{person.character}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Reviews</h3>
              <button className="text-sm text-accent flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Your Review
              </button>
            </div>
            
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                          {review.author_details.avatar_path ? (
                            <img 
                              src={`https://image.tmdb.org/t/p/w200${review.author_details.avatar_path}`} 
                              alt={review.author}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">{review.author.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{review.author}</h4>
                          <p className="text-xs text-gray-400">From {review.author_details.name || 'Web'}</p>
                        </div>
                      </div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star}
                            xmlns="http://www.w3.org/2000/svg" 
                            className={`h-4 w-4 ${star <= (review.author_details.rating / 2) ? 'text-accent' : 'text-gray-600'}`} 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="text-sm ml-1">{(review.author_details.rating / 2).toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 line-clamp-3">{review.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center">
                <p className="text-gray-400">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Details */}
        <div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Release Year</h3>
            <p className="text-gray-300">{movie.year}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Available Languages</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-700 px-2 py-1 rounded text-sm">English</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-sm">Hindi</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-sm">Tamil</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-sm">Telugu</span>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Ratings</h3>
            <div className="flex items-center mb-2">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg 
                    key={star}
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-5 w-5 ${star <= Math.round(movie.rating / 2) ? 'text-accent' : 'text-gray-600'}`} 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-accent font-bold">{(movie.rating / 2).toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <div>
                <h4 className="text-sm font-medium">IMDB</h4>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span>{movie.rating.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Streamvibe</h4>
                <div className="flex items-center">
                  <svg className="h-4 w-4 text-accent mr-1" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                  <span>{(movie.rating / 2).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Genres</h3>
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre, index) => (
                <span key={index} className="bg-gray-700 px-2 py-1 rounded text-sm">{genre}</span>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4">Director</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                <span className="text-lg">D</span>
              </div>
              <div>
                <h4 className="font-medium">Rishab Shetty</h4>
                <p className="text-xs text-gray-400">Filmmaker</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      
      {/* Trailer Modal */}
      <TrailerModal 
        movieId={id}
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
      />
    </>
  );
};

export default MovieDetails;
