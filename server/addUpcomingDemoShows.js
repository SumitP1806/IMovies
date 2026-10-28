
const mongoose = require('mongoose');

const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Screen = require('./models/Screen');
const Show = require('./models/Show');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

const MOVIE_TITLES = [
  'Avatar: Fire and Ash',
  'Avengers: Secret Wars',
  'Spider-Man: Beyond the Spider-Verse'
];

const CITY = 'Mumbai';
const DAYS_TO_SCHEDULE = 7;
const BUFFER_MINUTES = 20;
const APPLY_CHANGES = process.argv.includes('--apply');

function dateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function toMinutes(time) {
  if (!time) return null;

  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = Number(match[1]) % 12;
  const minutes = Number(match[2]);

  if (match[3].toUpperCase() === 'PM') hours += 12;

  return hours * 60 + minutes;
}

function formatTime(totalMinutes) {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;

  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${suffix}`;
}

function overlaps(startA, endA, startB, endB) {
  return startA < endB && startB < endA;
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB.');
  console.log(APPLY_CHANGES ? 'MODE: APPLY' : 'MODE: DRY RUN — no changes will be saved');
  console.log(`City: ${CITY}`);

  const movies = await Movie.find({
    title: { $in: MOVIE_TITLES }
  });

  for (const title of MOVIE_TITLES) {
    if (!movies.some(movie => movie.title === title)) {
      throw new Error(`Movie not found: "${title}". No shows were inserted.`);
    }
  }

  const movieByTitle = new Map(movies.map(movie => [movie.title, movie]));

  const theatres = await Theatre.find({
    city: new RegExp(`^${CITY}$`, 'i'),
    status: 'active'
  }).sort({ name: 1 });

  if (!theatres.length) {
    throw new Error(`No active theatres found in ${CITY}.`);
  }

  const theatreIds = theatres.map(theatre => theatre._id);

  const screens = await Screen.find({
    theatreId: { $in: theatreIds }
  }).sort({ screenName: 1 });

  if (!screens.length) {
    throw new Error(`No screens found in active ${CITY} theatres.`);
  }

  const screenIds = screens.map(screen => screen._id);
  const screenById = new Map(screens.map(screen => [String(screen._id), screen]));
  const theatreById = new Map(theatres.map(theatre => [String(theatre._id), theatre]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = Array.from({ length: DAYS_TO_SCHEDULE }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    return dateString(date);
  });

  const existingShows = await Show.find({
    screenId: { $in: screenIds },
    showDate: { $in: dates },
    status: 'active'
  }).populate('movieId', 'duration');

  // Keep all existing show intervals in memory.
  // New shows are checked against both existing and newly proposed shows.
  const occupied = new Map();

  function getIntervals(screenId, date) {
    const key = `${String(screenId)}|${date}`;
    if (!occupied.has(key)) occupied.set(key, []);
    return occupied.get(key);
  }

  for (const show of existingShows) {
  const start = toMinutes(show.startTime);

if (start === null) {
  throw new Error(
    `Cannot safely check existing show time: "${show.startTime}". No shows were inserted.`
  );
}

    const duration = show.movieId?.duration || 180;
    getIntervals(show.screenId, show.showDate).push({
      start,
      end: start + duration + BUFFER_MINUTES,
      label: `existing show ${show._id}`
    });
  }

  const proposed = [];
const slots = [7 * 60];
  // One demo show per movie per day.
  for (const date of dates) {
    for (const title of MOVIE_TITLES) {
      const movie = movieByTitle.get(title);
      const duration = Number(movie.duration);

      if (!Number.isFinite(duration) || duration <= 0) {
        throw new Error(`Invalid duration for "${title}".`);
      }

      let placed = false;

      for (const screen of screens) {
        const theatre = theatreById.get(String(screen.theatreId));
        if (!theatre) continue;

        for (const start of slots) {
          const end = start + duration;
          if (end > 24 * 60) continue;

          const intervals = getIntervals(screen._id, date);
          const conflicts = intervals.some(item =>
            overlaps(
              start,
              end + BUFFER_MINUTES,
              item.start,
              item.end
            )
          );

          if (conflicts) continue;

          const duplicate = await Show.exists({
            movieId: movie._id,
            theatreId: theatre._id,
            screenId: screen._id,
            showDate: date,
            startTime: formatTime(start),
            status: 'active'
          });

          if (duplicate) continue;

          const entry = {
            movieId: movie._id,
            theatreId: theatre._id,
            screenId: screen._id,
            showDate: date,
            startTime: formatTime(start),
            endTime: formatTime(end),
            seatPricing: {
              Regular: 220,
              Premium: 320,
              VIP: 500
            },
            bookedSeats: [],
            status: 'active'
          };

          proposed.push({
            title,
            theatre: theatre.name,
            screen: screen.screenName,
            ...entry
          });

          intervals.push({
            start,
            end: end + BUFFER_MINUTES,
            label: `proposed ${title}`
          });

          placed = true;
          break;
        }

        if (placed) break;
      }

      if (!placed) {
        console.warn(`No conflict-free slot found: ${title} on ${date}`);
      }
    }
  }

  console.log(`\nProposed shows: ${proposed.length}`);

  for (const item of proposed) {
    console.log(
      `${item.showDate} | ${item.startTime}-${item.endTime} | ` +
      `${item.title} | ${item.theatre} | ${item.screen}`
    );
  }

  if (!APPLY_CHANGES) {
    console.log('\nDRY RUN COMPLETE. Database was not changed.');
    console.log('Review the proposed schedule before running with --apply.');
    return;
  }

  if (!proposed.length) {
    console.log('Nothing to insert.');
    return;
  }

  // Insert only new show documents. Never delete or update existing shows.
  const documents = proposed.map(({ title, theatre, screen, ...show }) => show);
  const inserted = await Show.insertMany(documents, { ordered: true });

  console.log(`\nInserted ${inserted.length} demo shows.`);
  console.log('Existing shows and bookings were not intentionally modified.');
}

main()
  .catch(error => {
    console.error('\nERROR:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
