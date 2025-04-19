import { useState, useEffect } from 'react'
import './App.css'

// Import components
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import GenreSection from './components/GenreSection'
import MovieSection from './components/MovieSection'
import Footer from './components/Footer'
import MovieCard from './components/MovieCard'

// Import services
import movieService from './services/movieService'

function App() {
  // State for different movie categories
  const [nowPlayingMovies, setNowPlayingMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [upcomingMovies, setUpcomingMovies] = useState([])
  const [allGenres, setAllGenres] = useState([])
  
  // UI state
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [filteredMovies, setFilteredMovies] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch all movie data
  useEffect(() => {
    const fetchAllMovieData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch movies from different categories
        const [nowPlayingResponse, popularResponse, topRatedResponse, upcomingResponse, genres] = await Promise.all([
          movieService.getNowPlayingMovies(),
          movieService.getPopularMovies(),
          movieService.getTopRatedMovies(),
          movieService.getUpcomingMovies(),
          movieService.getGenres()
        ]);
        
        // Extract movies from responses
        const nowPlaying = nowPlayingResponse?.movies || [];
        const popular = popularResponse?.movies || [];
        const topRated = topRatedResponse?.movies || [];
        const upcoming = upcomingResponse?.movies || [];
        
        // Set state for all fetched data
        setNowPlayingMovies(nowPlaying);
        setPopularMovies(popular);
        setTopRatedMovies(topRated);
        setUpcomingMovies(upcoming);
        setAllGenres(genres);
        
        // Set filtered movies to now playing by default
        setFilteredMovies(nowPlaying);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching movie data:', error);
        setError('Failed to load movies. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchAllMovieData();
  }, []);

  // Filter movies based on search and genre
  useEffect(() => {
    // Combine all movies for filtering
    const allMovies = [...nowPlayingMovies, ...popularMovies, ...topRatedMovies, ...upcomingMovies];
    // Remove duplicates based on movie ID
    const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.id, movie])).values());
    
    let result = uniqueMovies;
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by genre
    if (selectedGenre !== 'All') {
      result = result.filter(movie => 
        movie.genres.includes(selectedGenre)
      );
    }
    
    setFilteredMovies(result);
  }, [nowPlayingMovies, popularMovies, topRatedMovies, upcomingMovies, searchQuery, selectedGenre]);

  return (
    <div className="bg-primary text-white min-h-screen">
      {/* Header with search functionality */}
      <Header onSearch={setSearchQuery} />
      
      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-96">
          <div className="text-center p-6 bg-secondary rounded-lg">
            <h3 className="text-xl font-bold text-accent mb-2">Error</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-full"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <HeroSection />
          
          {/* Genres Section */}
          <GenreSection 
            genres={allGenres} 
            selectedGenre={selectedGenre} 
            setSelectedGenre={setSelectedGenre} 
          />
          
          {/* Now Playing Movies */}
          <MovieSection 
            title="Now Playing" 
            subtitle="Movies" 
            category="now_playing" 
          />
          
          {/* Popular Movies */}
          <MovieSection 
            title="Popular Movies" 
            subtitle="Trending" 
            category="popular" 
          />
          
          {/* Top Rated Movies */}
          <MovieSection 
            title="Top Rated" 
            subtitle="Acclaimed" 
            category="top_rated" 
          />
          
          {/* Upcoming Movies */}
          <MovieSection 
            title="Coming Soon" 
            subtitle="Upcoming" 
            category="upcoming" 
          />
          
          {/* Filtered Movies (when search or genre filter is applied) */}
          {(searchQuery || selectedGenre !== 'All') && (
            <div className="px-6 md:px-12 py-10">
              <h2 className="text-2xl font-bold mb-6">
                {searchQuery ? `Search Results for "${searchQuery}"` : `${selectedGenre} Movies`}
              </h2>
              
              {filteredMovies.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">No movies found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredMovies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Footer */}
          <Footer />
        </>
      )}
    </div>
  )
}

export default App
