
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Movie = require('./models/Movie');
const Theatre = require('./models/Theatre');
const Screen = require('./models/Screen');
const Show = require('./models/Show');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

const theatresData = [
  {
    name: 'PVR INOX Grand Mall',
    address: 'High Street Phoenix, Lower Parel',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013'
  },
  {
    name: 'Cinepolis Seawoods Grand Central',
    address: 'Seawoods Railway Station Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400706'
  },
  {
    name: 'PVR Directors Cut Vasant Kunj',
    address: 'Ambience Mall, Vasant Kunj',
    city: 'Delhi-NCR',
    state: 'Delhi',
    pincode: '110070'
  },
  {
    name: 'INOX Nexus Forum Mall',
    address: 'Koramangala, Hosur Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560095'
  },
  {
    name: 'Prasads Multiplex',
    address: 'NTR Gardens, Necklace Road',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500063'
  }
];

const makeSeatLayout = () => {
  const rows = [];

  for (const [rowLetter, category, basePrice, count] of [
    ['A', 'VIP', 500, 8],
    ['B', 'VIP', 500, 8],
    ['C', 'Premium', 320, 10],
    ['D', 'Premium', 320, 10],
    ['E', 'Premium', 320, 10],
    ['F', 'Regular', 220, 12],
    ['G', 'Regular', 220, 12],
    ['H', 'Regular', 220, 12]
  ]) {
    rows.push({
      rowLetter,
      category,
      basePrice,
      seats: Array.from({ length: count }, (_, i) => ({
        seatNumber: i + 1,
        seatId: `${rowLetter}${i + 1}`,
        isAvailable: true
      }))
    });
  }

  return rows;
};

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

async function repairData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected.');

    const movies = await Movie.find({ status: 'now_showing' })
      .sort({ title: 1 });

    if (movies.length === 0) {
      throw new Error(
        'No now_showing movies found. Existing movie data was not changed.'
      );
    }

    console.log(`Found ${movies.length} now-showing movies.`);

    const theatres = [];

    for (const data of theatresData) {
      const theatre = await Theatre.findOneAndUpdate(
        { name: data.name, city: data.city },
        {
          $setOnInsert: {
            ...data,
            facilities: [
              'Dolby Atmos',
              '4K Projection',
              'Food & Beverages',
              'Parking',
              'Recliner Seats'
            ],
            status: 'active'
          }
        },
        { upsert: true, new: true, runValidators: true }
      );

      theatres.push(theatre);
    }

    console.log(`Theatres ready: ${theatres.length}`);

    const screens = [];

    for (const theatre of theatres) {
      for (const screenName of [
        'Screen 1 (IMAX Laser)',
        'Screen 2 (Dolby Atmos Prime)'
      ]) {
        const screenType = screenName.includes('IMAX')
          ? 'IMAX 3D / Dolby Atmos'
          : '4K Dolby Atmos';

        const screen = await Screen.findOneAndUpdate(
          { theatreId: theatre._id, screenName },
          {
            $setOnInsert: {
              theatreId: theatre._id,
              screenName,
              screenType,
              totalSeats: 82,
              seatLayout: makeSeatLayout(),
              seatCategories: [
                { name: 'Regular', basePrice: 220 },
                { name: 'Premium', basePrice: 320 },
                { name: 'VIP', basePrice: 500 }
              ]
            }
          },
          { upsert: true, new: true, runValidators: true }
        );

        screens.push({ theatre, screen });
      }
    }

    console.log(`Screens ready: ${screens.length}`);

    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() + i);
      dates.push(formatLocalDate(date));
    }

    const showTimings = [
      '10:30 AM',
      '02:00 PM',
      '06:15 PM',
      '09:45 PM'
    ];

    let showsReady = 0;

    for (const date of dates) {
      for (const { theatre, screen } of screens) {
        const screenIndex = screens.findIndex(
          item => item.screen._id.equals(screen._id)
        );

        const movie = movies[screenIndex % movies.length];

        for (const startTime of showTimings) {
          const pricing = {
            Regular: 220,
            Premium: 320,
            VIP: 500
          };

          await Show.findOneAndUpdate(
            {
              movieId: movie._id,
              theatreId: theatre._id,
              screenId: screen._id,
              showDate: date,
              startTime
            },
            {
              $setOnInsert: {
                movieId: movie._id,
                theatreId: theatre._id,
                screenId: screen._id,
                showDate: date,
                startTime,
                endTime: 'End of show',
                seatPricing: pricing,
                bookedSeats: [],
                status: 'active'
              }
            },
            { upsert: true, new: true, runValidators: true }
          );

          showsReady++;
        }
      }
    }

    console.log('----------------------------------');
    console.log('Repair completed successfully.');
    console.log(`Movies preserved: ${movies.length}`);
    console.log(`Theatres ready: ${theatres.length}`);
    console.log(`Screens ready: ${screens.length}`);
    console.log(`Shows checked/ready: ${showsReady}`);
    console.log('----------------------------------');
  } catch (error) {
    console.error('Repair failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

repairData();
