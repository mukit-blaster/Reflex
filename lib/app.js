const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const connectMongo = require('./mongo');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me';
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin';

if (!process.env.JWT_SECRET) {
  console.warn(
    '[reflex] JWT_SECRET not set — using insecure dev fallback. Set JWT_SECRET in your environment.'
  );
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (used in local dev; on Vercel these are served directly from /public)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Ensure DB is connected before any /api request
app.use('/api', async (req, res, next) => {
  try {
    await connectMongo();
    next();
  } catch (err) {
    console.error('Mongo connection error:', err);
    res.status(503).json({ message: 'Database unavailable' });
  }
});

// ---------- Auth helpers ----------
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
}

function authRequired(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// ---------- Auth routes ----------
app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'User created', user: { id: user._id, name, email } });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const name = (req.body?.name || '').trim();
    const password = (req.body?.password || '').trim();

    if (!name || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Built-in admin (env-driven)
    if (name === ADMIN_USER && password === ADMIN_PASS) {
      const token = signToken({ userId: 'admin', role: 'admin', name: ADMIN_USER });
      return res.json({
        token,
        user: { name: ADMIN_USER, email: 'admin@reflex.local', role: 'admin' },
      });
    }

    // Look up by name OR email so users can log in either way
    const user = await User.findOne({ $or: [{ name }, { email: name }] });
    if (!user) return res.status(400).json({ message: 'Invalid username or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid username or password' });

    const role = user.role || 'user';
    const token = signToken({ userId: user._id.toString(), role, name: user.name });
    res.json({
      token,
      user: { name: user.name, email: user.email, role },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/me', authRequired, (req, res) => {
  res.json({ user: req.user });
});

// ---------- Appointments ----------
app.post('/api/appointment', async (req, res) => {
  try {
    const { name, email, phone, date, time, doctor, notes } = req.body || {};
    if (!name || !email || !phone || !date || !time) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const appointment = await Appointment.create({
      name,
      email,
      phone,
      date,
      time,
      doctor,
      notes,
    });
    res.status(201).json({ message: 'Appointment saved', appointment });
  } catch (err) {
    console.error('Create appointment error:', err);
    res.status(500).json({ message: 'Error saving appointment' });
  }
});

app.get('/api/appointments', authRequired, adminOnly, async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { phone: new RegExp(q, 'i') },
      ];
    }
    const appointments = await Appointment.find(filter).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    console.error('Fetch appointments error:', err);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

app.put('/api/appointments/:id/status', authRequired, adminOnly, async (req, res) => {
  try {
    const { status } = req.body || {};
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/appointments/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Update appointment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/appointments/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Appointment not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete appointment error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- Users (admin) ----------
app.get('/api/users', authRequired, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/users/:id', authRequired, adminOnly, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ---------- Dashboard stats ----------
app.get('/api/dashboard-stats', authRequired, adminOnly, async (req, res) => {
  try {
    const [totalAppointments, pendingAppointments, approvedAppointments, totalUsers] =
      await Promise.all([
        Appointment.countDocuments(),
        Appointment.countDocuments({ status: 'Pending' }),
        Appointment.countDocuments({ status: 'Approved' }),
        User.countDocuments(),
      ]);
    res.json({
      totalAppointments,
      pendingAppointments,
      approvedAppointments,
      totalUsers,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ---------- Health ----------
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

module.exports = app;
