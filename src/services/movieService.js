import axios from 'axios';

// TMDB API configuration from environment variables
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
const POSTER_SIZE = import.meta.env.VITE_TMDB_POSTER_SIZE || 'w500';
const BACKDROP_SIZE = import.meta.env.VITE_TMDB_BACKDROP_SIZE || 'original';
const PROFILE_SIZE = import.meta.env.VITE_TMDB_PROFILE_SIZE || 'w185';
const LOGO_SIZE = import.meta.env.VITE_TMDB_LOGO_SIZE || 'w92';

// Create a reusable API client
const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
  params: {
    api_key: API_KEY,
    language: 'en-US'
  }
});

// Add request interceptor for caching if enabled
if (import.meta.env.VITE_ENABLE_CACHING === 'true') {
  const cache = new Map();
  const CACHE_DURATION = parseInt(import.meta.env.VITE_CACHE_DURATION || '3600') * 1000; // Convert to milliseconds
  
  tmdbApi.interceptors.request.use(config => {
    const url = config.url + JSON.stringify(config.params);
    const cachedResponse = cache.get(url);
    
    if (cachedResponse && (Date.now() - cachedResponse.timestamp < CACHE_DURATION)) {
      console.log(`Using cached response for: ${config.url}`);
      config.adapter = () => Promise.resolve({
        data: cachedResponse.data,
        status: 200,
        statusText: 'OK',
        headers: {},
        config,
        request: {}
      });
    }
    
    return config;
  });
  
  tmdbApi.interceptors.response.use(response => {
    const url = response.config.url + JSON.stringify(response.config.params);
    
    if (!cache.has(url)) {
      cache.set(url, {
        data: response.data,
        timestamp: Date.now()
      });
    }
    
    return response;
  });
}

// Format movie data
const formatMovie = (movie, genres = []) => {
  return {
    id: movie.id,
    title: movie.title,
    poster: movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}` : null,
    rating: movie.vote_average,
    year: new Date(movie.release_date).getFullYear(),
    genres: genres.length > 0 ? genres : (movie.genre_ids || []),
    description: movie.overview
  };
};

// Get now playing movies
export const getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/now_playing', {
      params: { 
        language: 'en-US',
        page: page 
      }
    });
    
    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        // Fetch additional movie details to get genres
        const detailsResponse = await tmdbApi.get(`/movie/${movie.id}`, {
          params: {
            language: 'en-US'
          }
        });
        return formatMovie(movie, detailsResponse.data.genres.map(genre => genre.name));
      })
    );
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    throw error;
  }
};

// Get movie details by ID
export const getMovieDetails = async (movieId) => {
  try {
    // Using the exact URL format provided
    const response = await tmdbApi.get(`/movie/${movieId}`, {
      params: {
        language: 'en-US'
      }
    });
    const movie = response.data;
    
    return {
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : null,
      backdrop: movie.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${movie.backdrop_path}` : null,
      rating: movie.vote_average,
      year: new Date(movie.release_date).getFullYear(),
      genres: movie.genres.map(genre => genre.name),
      description: movie.overview,
      tagline: movie.tagline,
      runtime: movie.runtime,
      budget: movie.budget,
      revenue: movie.revenue,
      status: movie.status,
      originalLanguage: movie.original_language,
      productionCompanies: movie.production_companies
    };
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error);
    throw error;
  }
};

// Get movie credits (cast and crew)
export const getMovieCredits = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`, {
      params: {
        language: 'en-US'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie credits for ID ${movieId}:`, error);
    throw error;
  }
};

// Get movie reviews
export const getMovieReviews = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/reviews`, {
      params: {
        language: 'en-US',
        page: 1
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie reviews for ID ${movieId}:`, error);
    throw error;
  }
};

// Get movie videos (trailers, teasers, etc.)
export const getMovieVideos = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`, {
      params: {
        language: 'en-US'
      }
    });
    
    // Filter for YouTube trailers and sort by newest first
    const trailers = response.data.results
      .filter(video => video.site === 'YouTube' && 
                    (video.type === 'Trailer' || video.type === 'Teaser'))
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    
    return trailers;
  } catch (error) {
    console.error(`Error fetching movie videos for ID ${movieId}:`, error);
    throw error;
  }
};

// Get popular movies
export const getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/popular', {
      params: { 
        language: 'en-US',
        page: page 
      }
    });
    
    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        // Fetch additional movie details to get genres
        const detailsResponse = await tmdbApi.get(`/movie/${movie.id}`, {
          params: {
            language: 'en-US'
          }
        });
        return formatMovie(movie, detailsResponse.data.genres.map(genre => genre.name));
      })
    );
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    throw error;
  }
};

// Get top rated movies
export const getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/top_rated', {
      params: { 
        language: 'en-US',
        page: page 
      }
    });
    
    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        // Fetch additional movie details to get genres
        const detailsResponse = await tmdbApi.get(`/movie/${movie.id}`, {
          params: {
            language: 'en-US'
          }
        });
        return formatMovie(movie, detailsResponse.data.genres.map(genre => genre.name));
      })
    );
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    throw error;
  }
};

// Get upcoming movies
export const getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/movie/upcoming', {
      params: { 
        language: 'en-US',
        page: page 
      }
    });
    
    const movies = await Promise.all(
      response.data.results.map(async (movie) => {
        // Fetch additional movie details to get genres
        const detailsResponse = await tmdbApi.get(`/movie/${movie.id}`, {
          params: {
            language: 'en-US'
          }
        });
        return formatMovie(movie, detailsResponse.data.genres.map(genre => genre.name));
      })
    );
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    throw error;
  }
};

// Get all genres
export const getGenres = async () => {
  try {
    const response = await tmdbApi.get('/genre/movie/list');
    return response.data.genres.map(genre => genre.name);
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Search movies by query
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: {
        query,
        page,
        include_adult: false,
        language: 'en-US'
      }
    });
    
    const movies = response.data.results.map(movie => formatMovie(movie));
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

// Search TV shows by query
export const searchTVShows = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/tv', {
      params: {
        query,
        page,
        include_adult: false,
        language: 'en-US'
      }
    });
    
    const shows = response.data.results.map(show => ({
      id: show.id,
      title: show.name,
      poster: show.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${show.poster_path}` : null,
      backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${show.backdrop_path}` : null,
      rating: show.vote_average,
      year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : null,
      description: show.overview
    }));
    
    return {
      shows,
      totalPages: response.data.total_pages,
      currentPage: page,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('Error searching TV shows:', error);
    throw error;
  }
};

// Get multi-search results (movies, TV shows, people)
export const multiSearch = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
        page,
        include_adult: false,
        language: 'en-US'
      }
    });
    
    const results = response.data.results.map(item => {
      if (item.media_type === 'movie') {
        return {
          ...formatMovie(item),
          mediaType: 'movie'
        };
      } else if (item.media_type === 'tv') {
        return {
          id: item.id,
          title: item.name,
          poster: item.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}` : null,
          backdrop: item.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${item.backdrop_path}` : null,
          rating: item.vote_average,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
          description: item.overview,
          mediaType: 'tv'
        };
      } else if (item.media_type === 'person') {
        return {
          id: item.id,
          name: item.name,
          profile: item.profile_path ? `${IMAGE_BASE_URL}${PROFILE_SIZE}${item.profile_path}` : null,
          knownFor: item.known_for_department,
          knownForTitles: item.known_for?.map(work => work.title || work.name) || [],
          mediaType: 'person'
        };
      }
      return null;
    }).filter(Boolean);
    
    return {
      results,
      totalPages: response.data.total_pages,
      currentPage: page,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('Error performing multi-search:', error);
    throw error;
  }
};

// Get movie recommendations
export const getMovieRecommendations = async (movieId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
      params: {
        language: 'en-US',
        page
      }
    });
    
    const movies = response.data.results.map(movie => formatMovie(movie));
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error(`Error fetching movie recommendations for ID ${movieId}:`, error);
    throw error;
  }
};

// Get similar movies
export const getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
      params: {
        language: 'en-US',
        page
      }
    });
    
    const movies = response.data.results.map(movie => formatMovie(movie));
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error(`Error fetching similar movies for ID ${movieId}:`, error);
    throw error;
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreId, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_adult: false,
        page
      }
    });
    
    const movies = response.data.results.map(movie => formatMovie(movie));
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error(`Error fetching movies by genre ID ${genreId}:`, error);
    throw error;
  }
};

// Get person details
export const getPersonDetails = async (personId) => {
  try {
    const response = await tmdbApi.get(`/person/${personId}`, {
      params: {
        language: 'en-US'
      }
    });
    
    return {
      id: response.data.id,
      name: response.data.name,
      biography: response.data.biography,
      birthday: response.data.birthday,
      deathday: response.data.deathday,
      gender: response.data.gender,
      placeOfBirth: response.data.place_of_birth,
      popularity: response.data.popularity,
      profile: response.data.profile_path ? `${IMAGE_BASE_URL}${PROFILE_SIZE}${response.data.profile_path}` : null,
      knownForDepartment: response.data.known_for_department,
      homepage: response.data.homepage,
      imdbId: response.data.imdb_id
    };
  } catch (error) {
    console.error(`Error fetching person details for ID ${personId}:`, error);
    throw error;
  }
};

// Get person movie credits
export const getPersonMovieCredits = async (personId) => {
  try {
    const response = await tmdbApi.get(`/person/${personId}/movie_credits`, {
      params: {
        language: 'en-US'
      }
    });
    
    const cast = response.data.cast.map(movie => ({
      id: movie.id,
      title: movie.title,
      character: movie.character,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : null,
      releaseDate: movie.release_date
    }));
    
    const crew = response.data.crew.map(movie => ({
      id: movie.id,
      title: movie.title,
      job: movie.job,
      department: movie.department,
      poster: movie.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}` : null,
      releaseDate: movie.release_date
    }));
    
    return { cast, crew };
  } catch (error) {
    console.error(`Error fetching person movie credits for ID ${personId}:`, error);
    throw error;
  }
};

// Get trending content (movies, TV shows, or people)
export const getTrending = async (mediaType = 'all', timeWindow = 'day', page = 1) => {
  try {
    const response = await tmdbApi.get(`/trending/${mediaType}/${timeWindow}`, {
      params: {
        language: 'en-US',
        page
      }
    });
    
    const results = response.data.results.map(item => {
      if (item.media_type === 'movie' || mediaType === 'movie') {
        return {
          ...formatMovie(item),
          mediaType: 'movie'
        };
      } else if (item.media_type === 'tv' || mediaType === 'tv') {
        return {
          id: item.id,
          title: item.name,
          poster: item.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${item.poster_path}` : null,
          backdrop: item.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${item.backdrop_path}` : null,
          rating: item.vote_average,
          year: item.first_air_date ? new Date(item.first_air_date).getFullYear() : null,
          description: item.overview,
          mediaType: 'tv'
        };
      } else if (item.media_type === 'person' || mediaType === 'person') {
        return {
          id: item.id,
          name: item.name,
          profile: item.profile_path ? `${IMAGE_BASE_URL}${PROFILE_SIZE}${item.profile_path}` : null,
          knownFor: item.known_for_department,
          popularity: item.popularity,
          mediaType: 'person'
        };
      }
      return null;
    }).filter(Boolean);
    
    return {
      results,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error(`Error fetching trending ${mediaType} for ${timeWindow}:`, error);
    throw error;
  }
};

// Get movie images (posters, backdrops)
export const getMovieImages = async (movieId) => {
  try {
    // Include language parameter to get images with English text when available
    const response = await tmdbApi.get(`/movie/${movieId}/images`, {
      params: {
        include_image_language: 'en,null'
      }
    });
    
    // Filter and process posters
    let posters = [];
    if (response.data.posters && response.data.posters.length > 0) {
      posters = response.data.posters.map(poster => ({
        filePath: `${IMAGE_BASE_URL}${POSTER_SIZE}${poster.file_path}`,
        aspectRatio: poster.aspect_ratio,
        height: poster.height,
        width: poster.width,
        language: poster.iso_639_1
      }));
    }
    
    // Filter and process backdrops
    let backdrops = [];
    if (response.data.backdrops && response.data.backdrops.length > 0) {
      backdrops = response.data.backdrops.map(backdrop => ({
        filePath: `${IMAGE_BASE_URL}${BACKDROP_SIZE}${backdrop.file_path}`,
        aspectRatio: backdrop.aspect_ratio,
        height: backdrop.height,
        width: backdrop.width,
        language: backdrop.iso_639_1
      }));
    }
    
    return { posters, backdrops };
  } catch (error) {
    console.error(`Error fetching movie images for ID ${movieId}:`, error);
    // Return empty arrays instead of throwing error to prevent app from crashing
    return { posters: [], backdrops: [] };
  }
};

// Get movie watch providers (where to watch)
export const getMovieWatchProviders = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/watch/providers`);
    return response.data.results; // Returns by country
  } catch (error) {
    console.error(`Error fetching movie watch providers for ID ${movieId}:`, error);
    throw error;
  }
};

// Get movie keywords
export const getMovieKeywords = async (movieId) => {
  try {
    const response = await tmdbApi.get(`/movie/${movieId}/keywords`);
    return response.data.keywords;
  } catch (error) {
    console.error(`Error fetching movie keywords for ID ${movieId}:`, error);
    throw error;
  }
};

// Get movie lists (collections)
export const getMovieCollections = async (collectionId) => {
  try {
    const response = await tmdbApi.get(`/collection/${collectionId}`, {
      params: {
        language: 'en-US'
      }
    });
    
    return {
      id: response.data.id,
      name: response.data.name,
      overview: response.data.overview,
      poster: response.data.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${response.data.poster_path}` : null,
      backdrop: response.data.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${response.data.backdrop_path}` : null,
      parts: response.data.parts.map(movie => formatMovie(movie))
    };
  } catch (error) {
    console.error(`Error fetching collection details for ID ${collectionId}:`, error);
    throw error;
  }
};

// Get movie certifications (ratings like PG, R, etc.)
export const getMovieCertifications = async (region = 'US') => {
  try {
    const response = await tmdbApi.get('/certification/movie/list');
    return response.data.certifications[region] || [];
  } catch (error) {
    console.error('Error fetching movie certifications:', error);
    throw error;
  }
};

// Discover movies with advanced filtering
export const discoverMovies = async (options = {}, page = 1) => {
  try {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        language: 'en-US',
        sort_by: options.sortBy || 'popularity.desc',
        include_adult: options.includeAdult || false,
        include_video: options.includeVideo || false,
        page,
        with_genres: options.withGenres,
        with_keywords: options.withKeywords,
        with_cast: options.withCast,
        with_crew: options.withCrew,
        with_companies: options.withCompanies,
        with_watch_providers: options.withWatchProviders,
        watch_region: options.watchRegion,
        with_watch_monetization_types: options.monetizationTypes,
        'vote_average.gte': options.minRating,
        'vote_average.lte': options.maxRating,
        'vote_count.gte': options.minVotes,
        'primary_release_date.gte': options.fromDate,
        'primary_release_date.lte': options.toDate,
        with_runtime_gte: options.minRuntime,
        with_runtime_lte: options.maxRuntime,
        with_original_language: options.language
      }
    });
    
    const movies = response.data.results.map(movie => formatMovie(movie));
    
    return {
      movies,
      totalPages: response.data.total_pages,
      currentPage: page,
      totalResults: response.data.total_results
    };
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
};

// Get TV show details
export const getTVShowDetails = async (tvId) => {
  try {
    const response = await tmdbApi.get(`/tv/${tvId}`, {
      params: {
        language: 'en-US',
        append_to_response: 'credits,videos,images,reviews,similar,recommendations,content_ratings'
      }
    });
    
    const show = response.data;
    
    return {
      id: show.id,
      name: show.name,
      poster: show.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${show.poster_path}` : null,
      backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${show.backdrop_path}` : null,
      rating: show.vote_average,
      firstAirDate: show.first_air_date,
      lastAirDate: show.last_air_date,
      genres: show.genres.map(genre => genre.name),
      overview: show.overview,
      status: show.status,
      numberOfSeasons: show.number_of_seasons,
      numberOfEpisodes: show.number_of_episodes,
      seasons: show.seasons,
      networks: show.networks,
      episodeRunTime: show.episode_run_time,
      inProduction: show.in_production,
      type: show.type,
      credits: show.credits,
      videos: show.videos,
      images: show.images,
      reviews: show.reviews,
      similar: show.similar,
      recommendations: show.recommendations,
      contentRatings: show.content_ratings
    };
  } catch (error) {
    console.error(`Error fetching TV show details for ID ${tvId}:`, error);
    throw error;
  }
};

// Get popular TV shows
export const getPopularTVShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/popular', {
      params: {
        language: 'en-US',
        page
      }
    });
    
    const shows = response.data.results.map(show => ({
      id: show.id,
      name: show.name,
      poster: show.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${show.poster_path}` : null,
      backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${show.backdrop_path}` : null,
      rating: show.vote_average,
      firstAirDate: show.first_air_date,
      overview: show.overview
    }));
    
    return {
      shows,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    throw error;
  }
};

// Get top rated TV shows
export const getTopRatedTVShows = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/top_rated', {
      params: {
        language: 'en-US',
        page
      }
    });
    
    const shows = response.data.results.map(show => ({
      id: show.id,
      name: show.name,
      poster: show.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${show.poster_path}` : null,
      backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${show.backdrop_path}` : null,
      rating: show.vote_average,
      firstAirDate: show.first_air_date,
      overview: show.overview
    }));
    
    return {
      shows,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching top rated TV shows:', error);
    throw error;
  }
};

// Get TV shows airing today
export const getTVShowsAiringToday = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/airing_today', {
      params: {
        language: 'en-US',
        page
      }
    });
    
    const shows = response.data.results.map(show => ({
      id: show.id,
      name: show.name,
      poster: show.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${show.poster_path}` : null,
      backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${show.backdrop_path}` : null,
      rating: show.vote_average,
      firstAirDate: show.first_air_date,
      overview: show.overview
    }));
    
    return {
      shows,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching TV shows airing today:', error);
    throw error;
  }
};

// Get TV shows on the air (currently airing)
export const getTVShowsOnTheAir = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/tv/on_the_air', {
      params: {
        language: 'en-US',
        page
      }
    });
    
    const shows = response.data.results.map(show => ({
      id: show.id,
      name: show.name,
      poster: show.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${show.poster_path}` : null,
      backdrop: show.backdrop_path ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${show.backdrop_path}` : null,
      rating: show.vote_average,
      firstAirDate: show.first_air_date,
      overview: show.overview
    }));
    
    return {
      shows,
      totalPages: response.data.total_pages,
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching TV shows on the air:', error);
    throw error;
  }
};

export default {
  // Movie endpoints
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieDetails,
  getMovieCredits,
  getMovieReviews,
  getMovieVideos,
  getMovieRecommendations,
  getSimilarMovies,
  getMoviesByGenre,
  getMovieImages,
  getMovieWatchProviders,
  getMovieKeywords,
  getMovieCollections,
  getMovieCertifications,
  discoverMovies,
  
  // TV show endpoints
  getPopularTVShows,
  getTopRatedTVShows,
  getTVShowsAiringToday,
  getTVShowsOnTheAir,
  getTVShowDetails,
  
  // Person endpoints
  getPersonDetails,
  getPersonMovieCredits,
  
  // Search endpoints
  searchMovies,
  searchTVShows,
  multiSearch,
  
  // Other endpoints
  getGenres,
  getTrending
};
