const express = require('express');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Simulated bookings in-memory
const bookings = {
  "2025-04-11": ["09:00", "10:30"],
  "2025-04-12": ["11:00"],
  "2025-04-13": ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30"] // example fully booked morning
};

// Endpoint to fetch bookings
app.get('/api/bookings', (req, res) => {
  res.json(bookings);
});

// Later, you can POST to add new bookings here too!

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
