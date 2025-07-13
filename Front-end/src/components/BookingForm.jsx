import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/BookingForm.css";

const API_URL = process.env.REACT_APP_API_BASE_URL;

const services = {
  "Manicure": 30,
  "Pedicure": 60,
  "Nail Art": 45,
  "Gel Removal": 20
};

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    date: null,
    time: ""
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookedSlots, setBookedSlots] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (formData.date && formData.service) {
      generateAvailableTimes();
    }
  }, [formData.date, formData.service, bookedSlots]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`);
      const data = await res.json();

      // Transform data into { date: [times...] }
      const grouped = {};
      data.forEach(b => {
        if (!grouped[b.date]) grouped[b.date] = [];
        grouped[b.date].push(b.time);
      });
      setBookedSlots(grouped);
    } catch (err) {
      console.error('Error fetching bookings', err);
    }
    setLoading(false);
  };

  const generateAvailableTimes = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 17;

    if (!formData.date || !formData.service) return;

    const selectedDate = formData.date.toISOString().split('T')[0];
    const bookedTimes = bookedSlots[selectedDate] || [];

    const serviceDuration = services[formData.service] || 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        const endMinutes = hour * 60 + min + serviceDuration;
        if (endMinutes > endHour * 60) continue;

        if (!bookedTimes.includes(time)) {
          slots.push(time);
        }
      }
    }

    setAvailableTimes(slots);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = date => {
    setFormData(prev => ({ ...prev, date }));
  };

  const isFullyBooked = (date) => {
    const day = date.toISOString().split('T')[0];
    const times = bookedSlots[day] || [];
    return times.length >= 18;
  };

  const filterDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today && !isFullyBooked(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, service, date, time } = formData;
    if (!name || !email || !service || !date || !time) {
      alert("Please complete all fields before submitting.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          service,
          date: date.toISOString().split('T')[0],
          time,
          status: 'pending'
        })
      });

      if (res.ok) {
        alert('Booking request submitted! Await admin approval.');
        setFormData({ name: "", email: "", service: "", date: null, time: "" });
        fetchBookings();
      } else {
        const data = await res.json();
        alert('Error: ' + data.message);
      }
    } catch (err) {
      console.error('Error submitting booking', err);
      alert('An error occurred.');
    }
  };

  return (
    <div className="booking-form">
      <h2>Book Your Appointment</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <select
          name="service"
          value={formData.service}
          onChange={handleInputChange}
        >
          <option value="">Select a Service</option>
          {Object.keys(services).map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
        <DatePicker
          selected={formData.date}
          onChange={handleDateChange}
          filterDate={filterDate}
          placeholderText="Select a Date"
          minDate={new Date()}
        />
        <select
          name="time"
          value={formData.time}
          onChange={handleInputChange}
          disabled={!availableTimes.length}
        >
          <option value="">Select a Time</option>
          {availableTimes.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        <button type="submit">Submit Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;
