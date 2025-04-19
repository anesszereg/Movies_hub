import React from 'react';

const GenreSection = ({ genres, selectedGenre, setSelectedGenre }) => {
  // Main genres to display
  const mainGenres = [
    {
      name: 'Action',
      images: [
        'https://image.tmdb.org/t/p/w200/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        'https://image.tmdb.org/t/p/w200/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        'https://image.tmdb.org/t/p/w200/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
        'https://image.tmdb.org/t/p/w200/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg'
      ]
    },
    {
      name: 'Adventure',
      images: [
        'https://image.tmdb.org/t/p/w200/A3ZbZsmsvNGdprRi2lKgGEeVLEH.jpg',
        'https://image.tmdb.org/t/p/w200/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
        'https://image.tmdb.org/t/p/w200/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg',
        'https://image.tmdb.org/t/p/w200/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'
      ]
    },
    {
      name: 'Comedy',
      images: [
        'https://image.tmdb.org/t/p/w200/8kOWDBK6XlPUzckuHm4xLhTqNb4.jpg',
        'https://image.tmdb.org/t/p/w200/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg',
        'https://image.tmdb.org/t/p/w200/4j0PNHkMr5ax3IA8tjtxcmPU3QT.jpg',
        'https://image.tmdb.org/t/p/w200/5P8SmMzSNYikXpxil6BYzJ16611.jpg'
      ]
    },
    {
      name: 'Drama',
      images: [
        'https://image.tmdb.org/t/p/w200/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        'https://image.tmdb.org/t/p/w200/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
        'https://image.tmdb.org/t/p/w200/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg',
        'https://image.tmdb.org/t/p/w200/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg'
      ]
    },
    {
      name: 'Horror',
      images: [
        'https://image.tmdb.org/t/p/w200/bShgiEQoPnWdw4LBrYT5u18JF34.jpg',
        'https://image.tmdb.org/t/p/w200/wGE4ImqYjJZQi3xFu4I2OLm8m0w.jpg',
        'https://image.tmdb.org/t/p/w200/kdPMUMJzyYAc4roD52qavX0nLIC.jpg',
        'https://image.tmdb.org/t/p/w200/A7EByudX0eOzlkQ2FIbogzyazm2.jpg'
      ]
    }
  ];

  return (
    <div className="px-6 md:px-12 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Our Genres</h2>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex space-x-1">
            <div className="w-2 h-2 rounded-full bg-accent"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mainGenres.map((genre) => (
          <div 
            key={genre.name}
            onClick={() => setSelectedGenre(genre.name)}
            className={`cursor-pointer rounded-lg overflow-hidden bg-gray-800 hover:bg-gray-700 transition-colors ${selectedGenre === genre.name ? 'ring-2 ring-accent' : ''}`}
          >
            <div className="grid grid-cols-2 grid-rows-2 gap-0.5">
              {genre.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`${genre.name} movie ${index+1}`} 
                  className="w-full h-24 object-cover"
                />
              ))}
            </div>
            <div className="p-4 flex items-center justify-between">
              <span className="text-lg font-medium">{genre.name}</span>
              <div className="bg-gray-700 p-1.5 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenreSection;
