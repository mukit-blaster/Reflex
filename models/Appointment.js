const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  doctor: { type: String },
  notes: { type: String },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
