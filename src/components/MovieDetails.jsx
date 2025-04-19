import React, { useState, useEffect, useRef } from 'react';
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
  const [movieVideo, setMovieVideo] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const videoRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [watchProviders, setWatchProviders] = useState(null);
  const [images, setImages] = useState({ backdrops: [], posters: [] });
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const [movieData, credits, reviewsData, videos, similar, recommended, providers, movieImages] = await Promise.all([
          movieService.getMovieDetails(id),
          movieService.getMovieCredits(id),
          movieService.getMovieReviews(id),
          movieService.getMovieVideos(id),
          movieService.getSimilarMovies(id),
          movieService.getMovieRecommendations(id),
          movieService.getMovieWatchProviders(id),
          movieService.getMovieImages(id)
        ]);
        
        setMovie(movieData);
        setCast(credits.cast.slice(0, 8));
        setReviews(reviewsData.results.slice(0, 2));
        
        // Set the first trailer as the background video
        if (videos && videos.length > 0) {
          setMovieVideo(videos[0]);
        }
        
        // Set similar movies
        if (similar && similar.movies) {
          setSimilarMovies(similar.movies.slice(0, 8));
        }
        
        // Set recommended movies
        if (recommended && recommended.movies) {
          setRecommendations(recommended.movies.slice(0, 8));
        }
        
        // Set watch providers
        if (providers) {
          // Get US providers, or first available country if US not available
          const usProviders = providers.US || Object.values(providers)[0];
          setWatchProviders(usProviders);
        }
        
        // Set movie images
        if (movieImages) {
          setImages({
            backdrops: movieImages.backdrops.slice(0, 6),
            posters: movieImages.posters.slice(0, 6)
          });
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details. Please try again later.');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);
  
  // Handle video loaded state
  const handleVideoLoaded = () => {
    setVideoLoaded(true);
  };
  
  // Handle scroll-based video muting
  useEffect(() => {
    const handleScroll = () => {
      if (!heroSectionRef.current || !videoRef.current) return;
      
      const heroRect = heroSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // If more than half of the hero section is out of view, mute the video
      if (heroRect.bottom < windowHeight / 2 || heroRect.top > windowHeight / 2) {
        if (!videoMuted) {
          setVideoMuted(true);
          // We need to recreate the iframe to change the mute parameter
          if (videoRef.current) {
            const currentSrc = videoRef.current.src;
            videoRef.current.src = currentSrc.replace('mute=0', 'mute=1');
          }
        }
      } else {
        if (videoMuted) {
          setVideoMuted(false);
          // We need to recreate the iframe to change the mute parameter
          if (videoRef.current) {
            const currentSrc = videoRef.current.src;
            videoRef.current.src = currentSrc.replace('mute=1', 'mute=0');
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [videoMuted]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-primary">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-primary text-white">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-accent text-white rounded-full hover:bg-accent/80"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="bg-primary text-white min-h-screen">
      {/* Hero Section with Video Background */}
      <div ref={heroSectionRef} className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent z-10"></div>
        
        {/* Video or fallback image */}
        {movieVideo ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <iframe 
              ref={videoRef}
              src={`https://www.youtube.com/embed/${movieVideo.key}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&mute=0&playlist=${movieVideo.key}`}
              title={movie.title}
              className="absolute w-[300%] h-[300%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={handleVideoLoaded}
            ></iframe>
            
            {/* Show image while video is loading */}
            {!videoLoaded && (
              <img 
                src={movie.backdrop} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          <img 
            src={movie.backdrop} 
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg title-gradient">{movie.title}</h1>
          <p className="text-gray-200 max-w-3xl mb-6 text-lg drop-shadow-md">{movie.tagline || movie.description.split('.')[0] + '.'}</p>
          <div className="flex flex-wrap gap-4 fade-in">
            <button 
              onClick={() => setTrailerOpen(true)}
              className="btn-primary flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play Trailer
            </button>
            <button className="btn-secondary flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              Add to Watchlist
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 md:px-12 pt-10 border-b border-gray-800 sticky top-0 z-30 bg-primary/95 backdrop-blur-md">
        <div className="flex overflow-x-auto space-x-8 pb-4 container-custom">
          <button 
            onClick={() => setSelectedTab('overview')} 
            className={`text-lg font-medium whitespace-nowrap pb-2 border-b-2 ${selectedTab === 'overview' ? 'tab-active' : 'tab-inactive'}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setSelectedTab('cast')} 
            className={`text-lg font-medium whitespace-nowrap pb-2 border-b-2 ${selectedTab === 'cast' ? 'tab-active' : 'tab-inactive'}`}
          >
            Cast & Crew
          </button>
          <button 
            onClick={() => setSelectedTab('media')} 
            className={`text-lg font-medium whitespace-nowrap pb-2 border-b-2 ${selectedTab === 'media' ? 'tab-active' : 'tab-inactive'}`}
          >
            Media Gallery
          </button>
          <button 
            onClick={() => setSelectedTab('similar')} 
            className={`text-lg font-medium whitespace-nowrap pb-2 border-b-2 ${selectedTab === 'similar' ? 'tab-active' : 'tab-inactive'}`}
          >
            Similar Movies
          </button>
          <button 
            onClick={() => setSelectedTab('watch')} 
            className={`text-lg font-medium whitespace-nowrap pb-2 border-b-2 ${selectedTab === 'watch' ? 'tab-active' : 'tab-inactive'}`}
          >
            Where to Watch
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      <div className="container-custom py-8 slide-up">
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Description */}
            <div className="md:col-span-2">
              <div className="glass-effect p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 title-gradient">Description</h3>
                <p className="text-gray-300">{movie.description}</p>
              </div>
              
              {/* Movie Info */}
              <div className="glass-effect p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 title-gradient">Movie Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Release Date</p>
                    <p>{new Date(movie.release_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Runtime</p>
                    <p>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Budget</p>
                    <p>{movie.budget ? `$${(movie.budget / 1000000).toFixed(1)} million` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Revenue</p>
                    <p>{movie.revenue ? `$${(movie.revenue / 1000000).toFixed(1)} million` : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              {/* Reviews */}
              <div className="glass-effect p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold title-gradient">Reviews</h3>
                  <a href="#" className="text-accent hover:underline">View All</a>
                </div>
                
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-700 pb-6">
                        <div className="flex items-center mb-2">
                          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                            {review.author_details.avatar_path ? (
                              <img 
                                src={review.author_details.avatar_path.startsWith('/http') 
                                  ? review.author_details.avatar_path.substring(1) 
                                  : `https://image.tmdb.org/t/p/w45${review.author_details.avatar_path}`} 
                                alt={review.author} 
                                className="w-10 h-10 rounded-full"
                              />
                            ) : (
                              <span className="text-white">{review.author.charAt(0).toUpperCase()}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{review.author}</p>
                            <div className="flex items-center">
                              {review.author_details.rating && (
                                <>
                                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  <span className="ml-1 text-sm">{review.author_details.rating} / 10</span>
                                </>
                              )}
                              <span className="mx-2 text-gray-500">•</span>
                              <span className="text-sm text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-300">{review.content.length > 300 ? review.content.substring(0, 300) + '...' : review.content}</p>
                        {review.content.length > 300 && (
                          <a href="#" className="text-accent hover:underline text-sm mt-2 inline-block">Read Full Review</a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No reviews available for this movie.</p>
                )}
              </div>
            </div>
            
            {/* Right Column - Poster and Details */}
            <div>
              <div className="glass-effect overflow-hidden mb-8 hover-zoom">
                <img 
                  src={movie.poster} 
                  alt={movie.title}
                  className="w-full"
                />
              </div>
              
              <div className="glass-effect p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 title-gradient">Details</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-400">Status</p>
                    <p>{movie.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Original Language</p>
                    <p>{movie.original_language}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Budget</p>
                    <p>{movie.budget ? `$${movie.budget.toLocaleString()}` : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Revenue</p>
                    <p>{movie.revenue ? `$${movie.revenue.toLocaleString()}` : 'N/A'}</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-effect p-6">
                <h3 className="text-xl font-bold mb-4 title-gradient">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre) => (
                    <span className="glass-effect text-white px-3 py-1 rounded-full text-sm hover-lift">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Cast & Crew Tab */}
        {selectedTab === 'cast' && (
          <div className="space-y-8">
            <div>
              <h2 className="section-title mb-6">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cast.map((person) => (
                  <div key={person.id} className="movie-card hover-lift">
                    <div className="aspect-w-2 aspect-h-3 overflow-hidden">
                      <img 
                        src={person.profile_path 
                          ? `https://image.tmdb.org/t/p/w300${person.profile_path}` 
                          : 'https://via.placeholder.com/300x450?text=No+Image'} 
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-medium truncate">{person.name}</p>
                      <p className="text-sm text-gray-400 truncate">{person.character}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Media Gallery Tab */}
        {selectedTab === 'media' && (
          <div className="space-y-10">
            {/* Backdrops */}
            <div>
              <h2 className="section-title mb-6">Backdrops</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {images.backdrops.map((image, index) => (
                  <div key={index} className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden hover-zoom">
                    <img 
                      src={image.filePath} 
                      alt={`${movie.title} backdrop ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Posters */}
            <div>
              <h2 className="section-title mb-6">Posters</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {images.posters.map((image, index) => (
                  <div key={index} className="aspect-w-2 aspect-h-3 rounded-lg overflow-hidden hover-zoom">
                    <img 
                      src={image.filePath} 
                      alt={`${movie.title} poster ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Similar Movies Tab */}
        {selectedTab === 'similar' && (
          <div className="space-y-10">
            {/* Similar Movies */}
            <div>
              <h2 className="section-title mb-6">Similar Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {similarMovies.map((movie) => (
                  <div key={movie.id} className="movie-card hover-lift">
                    <div className="aspect-w-2 aspect-h-3 overflow-hidden">
                      <img 
                        src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'} 
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{movie.title}</h3>
                      <div className="flex items-center mt-1">
                        <svg className="h-4 w-4 text-accent mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm">{(movie.rating / 2).toFixed(1)}</span>
                        <span className="text-sm text-gray-400 ml-2">{movie.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommendations */}
            <div>
              <h2 className="section-title mb-6">Recommended For You</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {recommendations.map((movie) => (
                  <div key={movie.id} className="movie-card hover-lift">
                    <div className="aspect-w-2 aspect-h-3 overflow-hidden">
                      <img 
                        src={movie.poster || 'https://via.placeholder.com/300x450?text=No+Image'} 
                        alt={movie.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium truncate">{movie.title}</h3>
                      <div className="flex items-center mt-1">
                        <svg className="h-4 w-4 text-accent mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm">{(movie.rating / 2).toFixed(1)}</span>
                        <span className="text-sm text-gray-400 ml-2">{movie.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Where to Watch Tab */}
        {selectedTab === 'watch' && (
          <div>
            <h2 className="section-title mb-6">Where to Watch</h2>
            {watchProviders ? (
              <div className="space-y-8">
                {/* Buy/Rent Section */}
                {watchProviders.buy && watchProviders.buy.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 title-gradient">Buy or Rent</h3>
                    <div className="flex flex-wrap gap-4">
                      {watchProviders.buy.map((provider) => (
                        <div key={provider.provider_id} className="glass-effect p-3 flex items-center space-x-3 hover-lift">
                          <img 
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                            alt={provider.provider_name}
                            className="w-10 h-10 rounded"
                          />
                          <span>{provider.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Streaming Section */}
                {watchProviders.flatrate && watchProviders.flatrate.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 title-gradient">Stream</h3>
                    <div className="flex flex-wrap gap-4">
                      {watchProviders.flatrate.map((provider) => (
                        <div key={provider.provider_id} className="glass-effect p-3 flex items-center space-x-3 hover-lift">
                          <img 
                            src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                            alt={provider.provider_name}
                            className="w-10 h-10 rounded"
                          />
                          <span>{provider.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Link to More Info */}
                {watchProviders.link && (
                  <div className="mt-6">
                    <a 
                      href={watchProviders.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      More Information
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-effect p-6 text-center">
                <p className="text-gray-400">No watch providers information available for this movie.</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Trailer Modal */}
      <TrailerModal 
        movieId={id}
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  );
};

export default MovieDetails;
