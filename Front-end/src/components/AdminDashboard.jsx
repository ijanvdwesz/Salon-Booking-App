import { useEffect, useState } from 'react';

// ✅ Hardcoded backend URL
const API_URL = 'https://salon-booking-app-vqzk.onrender.com';

const services = [
  "Manicure & Pedicure",
  "Acrylic & Gel Nails",
  "Nail Art & Design",
  "Facials & Skin Treatments",
  "Massage Therapy",
  "Professional Makeup",
  "Waxing & Threading",
  "Body Scrubs & Spa Packages",
  "Hair Cutting & Styling",
  "Barbering & Beard Grooming",
  "Hair Coloring & Highlights",
  "Deep Conditioning & Hair Treatments"
];

const serviceDurations = {
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
  "Deep Conditioning & Hair Treatments": 45
};

const availableTimes = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
];

function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchBookings();
    fetchUsers();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/bookings`);
      if (!res.ok) {
        const text = await res.text();
        console.error('Fetch bookings failed:', res.status, text);
        return;
      }
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      if (!res.ok) {
        const text = await res.text();
        console.error('Fetch users failed:', res.status, text);
        return;
      }
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const approveBooking = async (id) => {
    await fetch(`${API_URL}/api/bookings/${id}/approve`, { method: 'PATCH' });
    fetchBookings();
  };

  const rejectBooking = async (id) => {
    await fetch(`${API_URL}/api/bookings/${id}/reject`, { method: 'PATCH' });
    fetchBookings();
  };

  const deleteBooking = async (id) => {
    await fetch(`${API_URL}/api/bookings/${id}`, { method: 'DELETE' });
    fetchBookings();
  };

  const deleteUser = async (id) => {
    await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
    fetchUsers();
  };

  const startEditBooking = (booking) => {
    setEditing({ ...booking });
  };

  const parseTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const hasConflict = (editedBooking) => {
    const { _id, date, time, service } = editedBooking;
    const editedStart = parseTime(time);
    const editedEnd = editedStart + (serviceDurations[service] || 30);

    return bookings.some(b => {
      if (b._id === _id || b.date !== date) return false;
      const existingStart = parseTime(b.time);
      const existingEnd = existingStart + (serviceDurations[b.service] || 30);
      return (editedStart < existingEnd) && (existingStart < editedEnd);
    });
  };

  const saveEditedBooking = async () => {
    if (hasConflict(editing)) {
      alert("This time slot conflicts with another booking.");
      return;
    }
    const { _id, name, email, service, date, time, status } = editing;
    await fetch(`${API_URL}/api/bookings/${_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, service, date, time, status })
    });
    setEditing(null);
    fetchBookings();
  };

  const groupedBookings = bookings.reduce((acc, booking) => {
    if (!acc[booking.date]) acc[booking.date] = [];
    acc[booking.date].push(booking);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedBookings).sort((a, b) => new Date(a) - new Date(b));

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Dashboard</h1>

      <h2>Bookings</h2>
      {sortedDates.map(date => (
        <div key={date} style={{ marginBottom: '2rem' }}>
          <h3>{date}</h3>
          {groupedBookings[date].map(booking => (
            <div key={booking._id} style={{ paddingLeft: '1rem', marginBottom: '0.5rem' }}>
              {editing && editing._id === booking._id ? (
                <>
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                  <input value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                  <select value={editing.service} onChange={(e) => setEditing({ ...editing, service: e.target.value })}>
                    {services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <input type="date" value={editing.date} onChange={(e) => setEditing({ ...editing, date: e.target.value })} />
                  <select value={editing.time} onChange={(e) => setEditing({ ...editing, time: e.target.value })}>
                    {availableTimes.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value })}>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button onClick={saveEditedBooking}>Save</button>
                  <button onClick={() => setEditing(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <strong>{booking.name}</strong> | {booking.email} | {booking.service} | {booking.time} | <em>{booking.status}</em>
                  {booking.status === 'pending' && (
                    <>
                      <button onClick={() => approveBooking(booking._id)}>Approve</button>
                      <button onClick={() => rejectBooking(booking._id)}>Reject</button>
                    </>
                  )}
                  <button onClick={() => startEditBooking(booking)}>Edit</button>
                  <button onClick={() => deleteBooking(booking._id)}>Delete</button>
                </>
              )}
            </div>
          ))}
        </div>
      ))}

      <h2>Users</h2>
      {users.length === 0 && <p>No users found.</p>}
      {users.map(user => (
        <div key={user._id} style={{ marginBottom: "1rem" }}>
          {user.name} - {user.email}
          <button onClick={() => deleteUser(user._id)}>Delete User</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;
