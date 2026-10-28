
const mongoose = require('mongoose');
require('dotenv').config();

const Coupon = require('./models/Coupon');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/imovies';

const coupons = [
  {
    code: 'WELCOME50',
    description: 'Flat Rs. 50 off on movie bookings',
    discountType: 'flat',
    discountValue: 50,
    minimumAmount: 300,
    maxDiscount: 500,
    expiryDate: new Date('2026-12-31T23:59:59.999Z'),
    usageLimit: 500,
    timesUsed: 0,
    isActive: true
  },
  {
    code: 'IMOVIES100',
    description: 'Rs. 100 off on bookings above Rs. 800',
    discountType: 'flat',
    discountValue: 100,
    minimumAmount: 800,
    maxDiscount: 500,
    expiryDate: new Date('2026-12-31T23:59:59.999Z'),
    usageLimit: 300,
    timesUsed: 0,
    isActive: true
  },
  {
    code: 'BLOCKBUSTER20',
    description: '20% off, up to Rs. 150',
    discountType: 'percentage',
    discountValue: 20,
    minimumAmount: 500,
    maxDiscount: 150,
    expiryDate: new Date('2026-12-31T23:59:59.999Z'),
    usageLimit: 250,
    timesUsed: 0,
    isActive: true
  },
  {
    code: 'VIPCINEMA',
    description: '15% off VIP cinema bookings',
    discountType: 'percentage',
    discountValue: 15,
    minimumAmount: 600,
    maxDiscount: 200,
    expiryDate: new Date('2026-12-31T23:59:59.999Z'),
    usageLimit: 100,
    timesUsed: 0,
    isActive: true
  }
];

async function repairCoupons() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    let added = 0;

    for (const coupon of coupons) {
      const result = await Coupon.updateOne(
        { code: coupon.code },
        { $setOnInsert: coupon },
        { upsert: true, runValidators: true }
      );

      if (result.upsertedCount > 0) {
        added++;
        console.log(`Added coupon: ${coupon.code}`);
      } else {
        console.log(`Already exists; preserved: ${coupon.code}`);
      }
    }

    console.log(`Finished. New coupons added: ${added}`);
  } catch (error) {
    console.error('Coupon repair failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

repairCoupons();
