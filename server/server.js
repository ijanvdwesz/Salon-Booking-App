const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ added

const app = express();
const PORT = process.env.PORT || 5000;
const usersRoutes = require('./routes/users');

// === CONNECT TO MONGODB ATLAS ===
mongoose.connect('mongodb+srv://ijanvdwestz:Jenice18@cluster0.7hfkg.mongodb.net/nail_salon?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// === CORS Middleware ===
// List of allowed origins without trailing slashes
const allowedOrigins = [
  'https://salon-booking-hi9pl3ktg-ijan-van-der-westhuizens-projects.vercel.app',
  'https://salon-booking-app-git-main-ijan-van-der-westhuizens-projects.vercel.app',
  'https://salon-booking-g49jghg01-ijan-van-der-westhuizens-projects.vercel.app',
  'https://salon-booking.vercel.app',
  'https://salon-booking-dp9urkb6p-ijan-van-der-westhuizens-projects.vercel.app/'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      // Allow REST tools like Postman or curl with no origin
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS policy: Origin ${origin} not allowed.`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true,
}));

// === Middleware ===
app.use(express.json());

// === Mount Bookings Route ===
const bookingsRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingsRoutes);

app.use('/api/users', usersRoutes);

// === Dummy test data (optional, can be removed if MongoDB used fully) ===
let bookedSlots = [
  { date: '2025-04-15', time: '09:00' },
  { date: '2025-04-15', time: '10:00' },
];

// === Basic slot APIs (optional) ===
app.get('/api/booked-slots', (req, res) => {
  res.json(bookedSlots);
});

app.post('/api/book-slot', (req, res) => {
  const { date, time, service } = req.body;

  const isAlreadyBooked = bookedSlots.some(
    (slot) => slot.date === date && slot.time === time
  );

  if (isAlreadyBooked) {
    return res.status(400).json({ message: 'Time slot already booked' });
  }

  bookedSlots.push({ date, time, service });
  res.status(201).json({ message: 'Booking successful' });
});

// === Root route ===
app.get('/', (req, res) => {
  res.send('Nail Salon Booking Server is running 🚀');
});

// === Start server ===
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
