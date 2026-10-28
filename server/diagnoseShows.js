
require('dotenv').config();
const mongoose = require('mongoose');

const Movie = require('./models/Movie');
require('./models/Theatre');
const Show = require('./models/Show');

async function diagnoseShows() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/imovies'
    );

    const movies = await Movie.find({}).sort({ title: 1 });
    const cities = ['Mumbai', 'Delhi-NCR', 'Bengaluru', 'Hyderabad'];

    console.log('\n========== MOVIE SHOW REPORT ==========');

    for (const movie of movies) {
      const allShows = await Show.find({
        movieId: movie._id
      }).populate('theatreId', 'name city');

      const activeShows = allShows.filter(
        show => show.status === 'active'
      );

      console.log(`\nMovie: ${movie.title}`);
      console.log(`Movie ID: ${movie._id}`);
      console.log(`Status: ${movie.status}`);
      console.log(`Total shows: ${allShows.length}`);
      console.log(`Active shows: ${activeShows.length}`);

      for (const city of cities) {
        const count = activeShows.filter(
          show => show.theatreId &&
            show.theatreId.city === city
        ).length;

        console.log(`  ${city}: ${count}`);
      }
    }

    console.log('\n========== REPORT COMPLETE ==========');
  } catch (error) {
    console.error('Diagnosis failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

diagnoseShows();
