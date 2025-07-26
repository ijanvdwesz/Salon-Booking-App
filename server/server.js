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
app.use(cors({
  origin: [
    'https://salon-booking-hi9pl3ktg-ijan-van-der-westhuizens-projects.vercel.app', // old frontend domain
    'https://salon-booking-app-git-main-ijan-van-der-westhuizens-projects.vercel.app' // new frontend domain from your error logs
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  credentials: true
}));

// === Middleware ===
app.use(express.json());

// === Mount Bookings Route ===
const bookingsRoutes = require('./routes/bookings');
app.use('/api/bookings', bookingsRoutes);

app.use('/api/users', usersRoutes);

// === Dummy test data (can be removed if Mongo is used for all bookings) ===
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
