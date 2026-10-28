
require('dotenv').config();
const mongoose = require('mongoose');

const Movie = require('./models/Movie');
const Show = require('./models/Show');
require('./models/Theatre');

async function rebalanceShows() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI ||
      'mongodb://127.0.0.1:27017/imovies'
    );

    const movies = await Movie.find({ status: 'now_showing' })
      .sort({ title: 1 });

    if (movies.length === 0) {
      throw new Error('No now-showing movies found.');
    }

    const shows = await Show.find({ status: 'active' })
      .populate('theatreId', 'city')
      .sort({ showDate: 1, screenId: 1, startTime: 1 });

    const cityCounters = {};
    let updated = 0;
    let skipped = 0;

    for (const show of shows) {
      if (!show.theatreId) continue;

      // Do not modify shows that already have bookings.
      if (show.bookedSeats && show.bookedSeats.length > 0) {
        skipped++;
        continue;
      }

      const city = show.theatreId.city || 'Unknown';
      if (cityCounters[city] === undefined) {
        cityCounters[city] = 0;
      }

      const movie = movies[
        cityCounters[city] % movies.length
      ];

      cityCounters[city]++;

      if (String(show.movieId) !== String(movie._id)) {
        show.movieId = movie._id;
        await show.save();
        updated++;
      }
    }

    console.log('Show reassignment completed.');
    console.log('Movies available:', movies.length);
    console.log('Shows checked:', shows.length);
    console.log('Shows updated:', updated);
    console.log('Booked shows skipped:', skipped);
    console.log('Cities processed:', Object.keys(cityCounters));

  } catch (error) {
    console.error('Repair failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

rebalanceShows();
