const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { sendEmail } = require('../mailer');

// === CREATE a booking ===
router.post('/', async (req, res) => {
  try {
    const { name, email, service, date, time, status } = req.body;

    const newBooking = new Booking({
      name,
      email,
      service,
      date,
      time,
      status: status || 'pending'
    });

    await newBooking.save();

    await sendEmail({
      to: email,
      subject: 'Booking Request Received',
      html: `<p>Hi ${name},</p>
        <p>Your booking request for <strong>${service}</strong> on <strong>${date}</strong> at <strong>${time}</strong> has been received.</p>
        <p>Status: <strong>${newBooking.status}</strong></p>
        <p>We'll get back to you soon!</p>
        <p>— Spa Booking Team</p>`
    });

    res.status(201).json({ message: 'Booking request created!' });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// === GET all bookings ===
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
});

// === GET grouped bookings (date => times) ===
router.get('/grouped', async (req, res) => {
  try {
    const bookings = await Booking.find();
    const grouped = {};

    bookings.forEach((booking) => {
      const date = booking.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(booking.time);
    });

    res.json(grouped);
  } catch (error) {
    console.error('Error fetching grouped bookings:', error);
    res.status(500).json({ message: 'Failed to group bookings' });
  }
});

// ✅ PATCH: Update booking and send notification
router.patch('/:id', async (req, res) => {
  try {
    const { name, email, service, date, time, status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { name, email, service, date, time, status },
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Send update email
    await sendEmail({
      to: email,
      subject: 'Booking Updated',
      html: `<p>Hi ${name},</p>
        <p>Your booking has been <strong>updated</strong> with the following details:</p>
        <ul>
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
          <li><strong>Status:</strong> ${status}</li>
        </ul>
        <p>If you did not request this change, please contact us immediately.</p>
        <p>— Spa Booking Team</p>`
    });

    res.json(booking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Failed to update booking' });
  }
});

// === PATCH: Approve a booking ===
router.patch('/:id/approve', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await sendEmail({
      to: booking.email,
      subject: 'Booking Approved',
      html: `<p>Hi ${booking.name},</p>
        <p>Your booking on <strong>${booking.date}</strong> at <strong>${booking.time}</strong> for <strong>${booking.service}</strong> has been <strong>approved</strong>.</p>
        <p>See you soon!</p>
        <p>— Spa Booking Team</p>`
    });

    res.json(booking);
  } catch (error) {
    console.error('Error approving booking:', error);
    res.status(500).json({ message: 'Failed to approve booking' });
  }
});

// === PATCH: Reject a booking ===
router.patch('/:id/reject', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    await sendEmail({
      to: booking.email,
      subject: 'Booking Rejected',
      html: `<p>Hi ${booking.name},</p>
        <p>We're sorry to inform you that your booking on <strong>${booking.date}</strong> at <strong>${booking.time}</strong> for <strong>${booking.service}</strong> has been <strong>rejected</strong>.</p>
        <p>Please contact us to reschedule.</p>
        <p>— Spa Booking Team</p>`
    });

    res.json(booking);
  } catch (error) {
    console.error('Error rejecting booking:', error);
    res.status(500).json({ message: 'Failed to reject booking' });
  }
});

// === DELETE: Remove a booking ===
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
});

module.exports = router;
