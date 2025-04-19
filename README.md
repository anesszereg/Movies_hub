# StreamVibe Movie App

<p align="center">
  <img src="public/favicon.svg" alt="StreamVibe Logo" width="120" height="120">
</p>

<p align="center">
  A modern movie streaming platform built with React, featuring a beautiful UI, movie trailers, and real-time data from TMDB API.
</p>

## 🎬 Features

- **Modern UI Design**: Clean, responsive interface with dark theme optimized for movie browsing
- **Movie Categories**: Browse movies by Now Playing, Popular, Top Rated, and Upcoming
- **Pagination**: Navigate through multiple pages of movies in each category
- **Movie Details**: View comprehensive information about each movie
- **Trailer Playback**: Watch movie trailers directly within the app
- **Genre Filtering**: Filter movies by genre
- **Responsive Layout**: Optimized for all device sizes from mobile to desktop

## 🚀 Tech Stack

- **Frontend**: React, React Router
- **Styling**: Tailwind CSS
- **API**: The Movie Database (TMDB) API
- **Build Tool**: Vite

## 📋 Project Structure

```
/movies_react_app
├── public/
│   └── favicon.svg        # Custom StreamVibe logo
├── src/
│   ├── components/        # React components
│   │   ├── Header.jsx     # Navigation and branding
│   │   ├── HeroSection.jsx # Featured movie carousel
│   │   ├── GenreSection.jsx # Movie genres with filtering
│   │   ├── MovieSection.jsx # Movie category sections with pagination
│   │   ├── MovieCard.jsx  # Individual movie representation
│   │   ├── MovieDetails.jsx # Detailed movie view
│   │   ├── TrailerModal.jsx # Modal for playing trailers
│   │   └── Footer.jsx     # Site footer
│   ├── services/
│   │   └── movieService.js # API service for TMDB
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
└── index.html             # HTML entry point
```

## 🔧 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- TMDB API Key

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd movies_react_app
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory and add your TMDB API key
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 📱 Responsive Design

StreamVibe is designed to work beautifully on all device sizes:

- **Mobile**: Optimized layout for small screens
- **Tablet**: Adjusted grid for medium-sized screens
- **Desktop**: Full experience with multi-column layouts

## 🎭 Movie Trailer Feature

The trailer functionality allows users to:

- Watch trailers directly within the app without navigating away
- Access trailers from both movie cards and the movie details page
- View multiple trailers when available
- Enjoy a full-screen viewing experience

## 🔄 API Integration

StreamVibe integrates with the TMDB API to provide:

- Real-time movie data
- High-quality movie posters and backdrops
- Detailed movie information including cast, genres, and ratings
- Movie trailers and videos

## 🛠️ Future Enhancements

- User authentication
- Personalized movie recommendations
- Watchlist functionality
- Advanced search with filters
- User ratings and reviews

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for their excellent API
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [React](https://reactjs.org/) for the UI library
- [Vite](https://vitejs.dev/) for the fast build tool
