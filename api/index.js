const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const serverless = require('serverless-http');  // Required for serverless functions
const reportRoutes = require('../routes/reportRoutes');  // Adjust the path as needed

const app = express();

// Middleware for parsing form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());  // If you need JSON parsing

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, '../public')));  // Adjust path to public folder

// Set EJS as the template engine
app.set('view engine', 'ejs');

// Use the routes from reportRoutes.js
app.use(reportRoutes);  // Register the report routes

// Connect to MongoDB Atlas
const dbURI = process.env.DB_URI || 'mongodb+srv://ausiziba:Lobengula1@cluster0.u9d5c.mongodb.net/BusinessAdmin?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// The serverless handler for Express
module.exports.handler = serverless(app);
