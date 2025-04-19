import React, { useState, useEffect, useRef } from 'react';
import movieService from '../services/movieService';

const HeroSection = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [movieVideos, setMovieVideos] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [videoMuted, setVideoMuted] = useState(false);
  const videoRef = useRef(null);
  const heroSectionRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);

  // Fetch featured movies for the hero section
  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getNowPlayingMovies(1);
        const topMovies = response.movies.slice(0, 5); // Use only first 5 movies for the hero
        setFeaturedMovies(topMovies);
        setLoading(false);
        
        // Fetch videos for each featured movie
        topMovies.forEach(movie => {
          fetchMovieVideos(movie.id);
        });
      } catch (error) {
        console.error('Error fetching hero movies:', error);
        setLoading(false);
      }
    };
    
    fetchFeaturedMovies();
  }, []);

  // Fetch videos for a specific movie
  const fetchMovieVideos = async (movieId) => {
    try {
      setVideoLoading(true);
      const videos = await movieService.getMovieVideos(movieId);
      // Store videos in state using movieId as key
      setMovieVideos(prev => ({
        ...prev,
        [movieId]: videos.length > 0 ? videos[0] : null
      }));
      setVideoLoading(false);
    } catch (error) {
      console.error(`Error fetching videos for movie ID ${movieId}:`, error);
      setVideoLoading(false);
    }
  };

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredMovies.length - 1 ? 0 : prev + 1));
    }, 8000); // Change slide every 8 seconds
    
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

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

  const nextSlide = () => {
    if (!featuredMovies || featuredMovies.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    if (!featuredMovies || featuredMovies.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  const openTrailer = (movieId) => {
    setSelectedMovieId(movieId);
    setShowTrailerModal(true);
  };

  if (loading || !featuredMovies || featuredMovies.length === 0) {
    return <div className="h-[600px] bg-secondary animate-pulse"></div>;
  }

  return (
    <div ref={heroSectionRef} className="relative h-[80vh] overflow-hidden bg-primary">
      {featuredMovies.map((movie, index) => {
        const currentVideo = movieVideos[movie.id];
        const isCurrentSlide = index === currentSlide;
        
        return (
          <div 
            key={movie.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              isCurrentSlide ? 'opacity-100 z-20' : 'opacity-0 z-10'
            }`}
          >
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
            
            {/* Video or fallback image */}
            {currentVideo && isCurrentSlide ? (
              <div className="absolute inset-0 w-full h-full overflow-hidden">
                <iframe 
                  ref={videoRef}
                  src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=1&controls=0&showinfo=0&rel=0&loop=1&mute=0&playlist=${currentVideo.key}`}
                  title={movie.title}
                  className="absolute w-[300%] h-[300%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <img 
                src={movie.backdrop} 
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}
            
            {/* Movie details */}
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-20 text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">{movie.title}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-accent px-3 py-1 rounded-full text-sm font-bold">{movie.rating.toFixed(1)}</span>
                <span>{movie.year}</span>
                <span>{movie.genres.slice(0, 2).join(', ')}</span>
              </div>
              <p className="text-gray-200 max-w-2xl mb-8 line-clamp-2 text-lg drop-shadow-md">{movie.description}</p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => openTrailer(movie.id)}
                  className="bg-accent hover:bg-accent/80 text-white px-8 py-3 rounded-full flex items-center transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Trailer
                </button>
                <button className="border-2 border-white hover:bg-white hover:text-primary text-white px-8 py-3 rounded-full flex items-center transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        );
      })}
      
      {/* Navigation arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-accent/80 text-white p-3 rounded-full transition-all"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-30 bg-black/30 hover:bg-accent/80 text-white p-3 rounded-full transition-all"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {featuredMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-accent w-6' : 'bg-white/50 hover:bg-white/80'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Import TrailerModal component */}
      {showTrailerModal && selectedMovieId && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowTrailerModal(false)}></div>
          <div className="relative z-10 w-full max-w-6xl mx-auto mt-20">
            <iframe 
              src={`https://www.youtube.com/embed/${movieVideos[selectedMovieId]?.key}?autoplay=1`}
              title="Movie Trailer"
              className="w-full aspect-video rounded-lg shadow-2xl"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button 
              onClick={() => setShowTrailerModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-accent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroSection;
