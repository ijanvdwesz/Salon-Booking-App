import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/BookingForm.css";

// Updated services with durations (in minutes)
const services = {
  "Manicure & Pedicure": 60,
  "Acrylic & Gel Nails": 75,
  "Nail Art & Design": 45,
  "Facials & Skin Treatments": 60,
  "Massage Therapy": 60,
  "Professional Makeup": 90,
  "Waxing & Threading": 30,
  "Body Scrubs & Spa Packages": 90,
  "Hair Cutting & Styling": 45,
  "Barbering & Beard Grooming": 30,
  "Hair Coloring & Highlights": 90,
  "Deep Conditioning & Hair Treatments": 45,
};

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    service: "",
    date: null,
    time: "",
  });

  const [availableTimes, setAvailableTimes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (formData.date && formData.service) {
      generateAvailableTimes();
    } else {
      setAvailableTimes([]);
    }
  }, [formData.date, formData.service, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bookings`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
    setLoading(false);
  };

  const generateAvailableTimes = () => {
    const startHour = 8;
    const endHour = 17;
    const slotInterval = 30;
    const slots = [];

    const serviceDuration = services[formData.service] || 30;
    const selectedDate = formData.date.toISOString().split('T')[0];

    const sameDayBookings = bookings.filter(b => b.date === selectedDate);

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += slotInterval) {
        const slotStart = hour * 60 + min;
        const slotEnd = slotStart + serviceDuration;
        if (slotEnd > endHour * 60) continue;

        const slotTime = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;

        const overlaps = sameDayBookings.some(b => {
          const bookedStart = parseTimeToMinutes(b.time);
          const bookedDuration = services[b.service] || 30;
          const bookedEnd = bookedStart + bookedDuration;
          return (slotStart < bookedEnd && bookedStart < slotEnd);
        });

        if (!overlaps) slots.push(slotTime);
      }
    }

    setAvailableTimes(slots);
  };

  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = date => {
    setFormData(prev => ({ ...prev, date }));
  };

  const isFullyBooked = (date) => {
    const day = date.toISOString().split("T")[0];
    const dayBookings = bookings.filter(b => b.date === day);
    return dayBookings.length >= 18;
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
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          service,
          date: date.toISOString().split("T")[0],
          time,
          status: "pending",
        }),
      });

      if (res.ok) {
        alert("Booking request submitted! Await admin approval.");
        setFormData({ name: "", email: "", service: "", date: null, time: "" });
        fetchBookings();
      } else {
        const data = await res.json();
        alert("Error: " + data.message);
      }
    } catch (err) {
      console.error("Error submitting booking", err);
      alert("An error occurred.");
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

        <button type="submit" disabled={loading}>Submit Booking</button>
      </form>
    </div>
  );
};

export default BookingForm;
