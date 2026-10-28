const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Movie = require('./models/Movie');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

    const moviesData = [
      {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        genre: ['Sci-Fi', 'Adventure', 'Action'],
        language: ['English', 'Hindi'],
        duration: 166,
        releaseDate: new Date('2024-03-01'),
        rating: 8.8,
        ratingCount: 1420,
        cast: ['TimothÃ©e Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem', 'Austin Butler'],
        director: 'Denis Villeneuve',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Oppenheimer',
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
        poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/fm6K9vY9Wg9Kp3z8TehTeep7p5m.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
        genre: ['Biography', 'Drama', 'History'],
        language: ['English', 'Hindi'],
        duration: 180,
        releaseDate: new Date('2023-07-21'),
        rating: 8.9,
        ratingCount: 2300,
        cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.', 'Florence Pugh'],
        director: 'Christopher Nolan',
        certification: 'A',
        status: 'now_showing'
      },
      {
        title: 'Deadpool & Wolverine',
        description: 'A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him. But when his homeworld faces an existential threat, Wade must reluctantly suit up with an even more reluctant Wolverine.',
        poster: 'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
        genre: ['Action', 'Comedy', 'Sci-Fi'],
        language: ['English', 'Hindi', 'Tamil', 'Telugu'],
        duration: 128,
        releaseDate: new Date('2024-07-26'),
        rating: 8.4,
        ratingCount: 1850,
        cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Matthew Macfadyen'],
        director: 'Shawn Levy',
        certification: 'A',
        status: 'now_showing'
      },
      {
        title: 'Gladiator II',
        description: 'Years after witnessing the death of revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
        poster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/euYIwmwkmz95mnEx7vBM0Mqz5r9.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
        genre: ['Action', 'Adventure', 'Drama'],
        language: ['English', 'Hindi'],
        duration: 148,
        releaseDate: new Date('2024-11-15'),
        rating: 8.1,
        ratingCount: 940,
        cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
        director: 'Ridley Scott',
        certification: 'A',
        status: 'now_showing'
      },
      {
        title: 'Interstellar',
        description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
        genre: ['Sci-Fi', 'Drama', 'Adventure'],
        language: ['English', 'Hindi'],
        duration: 169,
        releaseDate: new Date('2014-11-07'),
        rating: 8.7,
        ratingCount: 3100,
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        director: 'Christopher Nolan',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
        genre: ['Action', 'Crime', 'Drama'],
        language: ['English', 'Hindi'],
        duration: 152,
        releaseDate: new Date('2008-07-18'),
        rating: 9.0,
        ratingCount: 4500,
        cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine', 'Gary Oldman'],
        director: 'Christopher Nolan',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Jawan',
        description: 'A high-octane action thriller which outlines the emotional journey of a man who is set out to rectify the wrongs in the society while honoring a promise made years ago.',
        poster: 'https://image.tmdb.org/t/p/w500/jYW3g3jXUeE1r7Oa5p9j9YyFvXf.jpg',
        backdrop: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=MWOlnZSnXWE',
        genre: ['Action', 'Thriller'],
        language: ['Hindi', 'Tamil', 'Telugu'],
        duration: 169,
        releaseDate: new Date('2023-09-07'),
        rating: 7.9,
        ratingCount: 1680,
        cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone'],
        director: 'Atlee',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'RRR',
        description: 'A fearless revolutionary and an officer in the British force, who once shared a deep bond, decide to join forces and chart out an inspiring path of freedom against the despotic rulers.',
        poster: 'https://image.tmdb.org/t/p/w500/nEufeZlyAOLqO2brrs0yeMu1QXO.jpg',
        backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=NgBoAM8G4Yk',
        genre: ['Action', 'Drama'],
        language: ['Telugu', 'Hindi', 'Tamil'],
        duration: 187,
        releaseDate: new Date('2022-03-25'),
        rating: 8.3,
        ratingCount: 2200,
        cast: ['N. T. Rama Rao Jr.', 'Ram Charan', 'Ajay Devgn', 'Alia Bhatt'],
        director: 'S. S. Rajamouli',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Inception',
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team.',
        poster: 'https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg',
        backdrop: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
        genre: ['Action', 'Sci-Fi', 'Thriller'],
        language: ['English', 'Hindi'],
        duration: 148,
        releaseDate: new Date('2010-07-16'),
        rating: 8.8,
        ratingCount: 3900,
        cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
        director: 'Christopher Nolan',
        certification: 'UA',
        status: 'now_showing'
      },
      {
        title: 'Avatar: Fire and Ash',
        description: 'The journey continues as Jake Sully and Neytiri encounter a new, aggressive volcanic clan of Na\'vi known as the "Ash People", testing Pandora to its limits.',
        poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
        genre: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
        language: ['English', 'Hindi'],
        duration: 190,
        releaseDate: new Date('2025-12-19'),
        rating: 0,
        ratingCount: 0,
        cast: ['Sam Worthington', 'Zoe SaldaÃ±a', 'Sigourney Weaver', 'Stephen Lang'],
        director: 'James Cameron',
        certification: 'UA',
        status: 'upcoming'
      },
      {
        title: 'Avengers: Secret Wars',
        description: 'The culmination of the Multiverse Saga brings Earth\'s mightiest heroes together with iconic variants across time and reality to combat a cataclysmic multiversal collapse.',
        poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        genre: ['Action', 'Sci-Fi', 'Adventure'],
        language: ['English', 'Hindi', 'Tamil', 'Telugu'],
        duration: 185,
        releaseDate: new Date('2027-05-07'),
        rating: 0,
        ratingCount: 0,
        cast: ['Pedro Pascal', 'Robert Downey Jr.', 'Benedict Cumberbatch', 'Tom Holland'],
        director: 'Anthony Russo, Joe Russo',
        certification: 'UA',
        status: 'upcoming'
      },
      {
        title: 'Spider-Man: Beyond the Spider-Verse',
        description: 'Miles Morales traverses the boundless multiverse to rescue his loved ones from the perils of destiny and stop the devastating collision of realities.',
        poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=500&q=80',
        backdrop: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
        trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
        genre: ['Animation', 'Action', 'Sci-Fi'],
        language: ['English', 'Hindi'],
        duration: 140,
        releaseDate: new Date('2026-06-12'),
        rating: 0,
        ratingCount: 0,
        cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac', 'Daniel Kaluuya'],
        director: 'Joaquim Dos Santos, Kemp Powers',
        certification: 'U',
        status: 'upcoming'
      }
    ];


async function seedMoviesOnly() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    const existingMovies = await Movie.find({}, 'title');
    const existingTitles = new Set(
      existingMovies.map(movie => movie.title.trim().toLowerCase())
    );

    const missingMovies = moviesData.filter(
      movie => !existingTitles.has(movie.title.trim().toLowerCase())
    );

    if (missingMovies.length === 0) {
      console.log('All movie titles already exist. Nothing inserted.');
    } else {
      await Movie.insertMany(missingMovies);
      console.log(`Inserted ${missingMovies.length} missing movies.`);
    }

    console.log(`Total movies in database: ${await Movie.countDocuments()}`);
  } catch (error) {
    console.error('Movie seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedMoviesOnly();
