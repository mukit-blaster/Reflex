require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Appointment = require('./models/Appointment');

const User = require('./models/User');
const bodyParser = require('body-parser');
const JWT_SECRET = 'your_jwt_secret';


const cors = require('cors');



const app = express();
const port = process.env.PORT || 8080;

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));


// Middleware to parse incoming form and JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/booking.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'booking.html'));
});

app.get('/yoga.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'yoga.html'));
});

app.get('/reading.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reading.html'));
});


app.get('/dashboard.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});



// API endpoint to handle appointment form submissions
app.post("/appointment", async (req, res) => {
  try {
    const { name, email, phone, date, time } = req.body;
    const newAppointment = new Appointment({ name, email, phone, date, time });
    await newAppointment.save();
    res.status(201).json({ message: "Appointment saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving appointment" });
  }
});



app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find({});
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});






// Update appointment status
// PUT route to update only status
app.put('/appointments/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({ success: true, data: updatedAppointment });
  } catch (error) {
    console.error('Status update failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});



// PUT route to update an appointment
app.put('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, updatedData, { new: true });
    if (!appointment) return res.status(404).json({ error: 'Appointment not found' });
    res.json({ success: true, data: appointment });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ error: 'Server error' });
  }
});





// Signup Route
app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).send('User created successfully');
  } catch (error) {
    res.status(400).send('Error creating user');
  }
});

// Login Route
// app.post('/login', async (req, res) => {
//   console.log("Login route hit:", req.body); // Add this line
//   const { name, password } = req.body;

//   try {
//     const user = await User.findOne({ name });
//     if (!user) {
//       console.log("User not found");
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log("Password mismatch");
//       return res.status(400).json({ message: 'Invalid username or password' });
//     }

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

//     console.log("Login successful for:", user.name);

//     res.json({
//       token,
//       user: {
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (err) {
//     console.error("Server error:", err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

app.post('/login', async (req, res) => {
  // Trim input to remove leading/trailing spaces
  const name = req.body.name?.trim();
  const password = req.body.password?.trim();

  console.log("Login route hit:", { name, password });

  try {
    // ✅ Admin shortcut
    if (name === 'admin' && password === 'admin') {
      console.log("Admin login successful");
      const token = jwt.sign({ userId: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
      return res.json({
        token,
        user: {
          name: 'admin',
          email: 'admin@example.com',
        },
      });
    }

    // ✅ DB login
    const user = await User.findOne({ name });
    if (!user) {
      console.log("User not found in DB:", name);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Incorrect password for:", name);
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



  

// Fetch all users
// Fetch all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});










app.get('/dashboard-stats', async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
    const totalUsers = await User.countDocuments(); // ← update here

    res.json({
      totalAppointments,
      pendingAppointments,
      totalUsers // ← send this instead of newUsersToday
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// Start server
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});
