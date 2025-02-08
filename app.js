
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const reportRoutes = require('./routes/reportRoutes'); // Adjust the path as needed

const app = express();

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // If you need JSON parsing

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Use the routes from reportRoutes.js
app.use(reportRoutes);  // This line is crucial for registering the routes

// Connect to MongoDB Atlas
const dbURI = 'mongodb+srv://ausiziba:Lobengula1@cluster0.u9d5c.mongodb.net/BusinessAdmin?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(3000, () => console.log('Server running on http://localhost:3000')))
  .catch(err => console.log('MongoDB connection error:', err));


