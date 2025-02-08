const express = require('express');
const router = express.Router();
const Report = require('../models/Reports');
const reportController = require('../controllers/reportController');

// Home Page (optional, check if it's needed)
router.get('/', (req, res) => {
  res.render('index', { filters: {} });  // Pass an empty object if no filters applied
});

// Submit Report Page (for GET and POST requests)
router.get('/submit', (req, res) => {
  res.render('submit');
});

router.post('/submit', async (req, res) => {
  try {
    const { name, surname, team, branch, appointments, presentations, closedCases, callBacks, referrals } = req.body;

    const report = new Report({
      name,
      surname,
      team,
      branch,
      appointments,
      presentations,
      closedCases,
      callBacks,
      referrals,
      date: new Date()
    });

    await report.save();
    res.redirect('/reports');
  } catch (err) {
    console.error("Error saving report:", err);
    res.status(500).send("Failed to save report.");
  }
});

// View Reports Page with filtering
router.get('/reports', async (req, res) => {
  try {
    // Extract filters from query parameters
    const { startDate, endDate, agent, team } = req.query;
    
    // Build filter object
    const filter = {};

    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (agent) {
      filter.$or = [
        { name: { $regex: agent, $options: 'i' } },
        { surname: { $regex: agent, $options: 'i' } }
      ];
    }
    if (team) {
      filter.team = { $regex: team, $options: 'i' };
    }

    const reports = await Report.find(filter).sort({ date: -1 });
    res.render('reports', { reports, filters: { startDate, endDate, agent, team } });
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).send("Failed to load reports.");
  }
});

// Download Excel & PDF
router.get('/reports', reportController.viewReports);  // Calls viewReports from controller
router.get('/dashboard', reportController.dashboard);  // Calls dashboard from controller
router.get('/download/pdf', reportController.downloadPDF);  // Calls downloadPDF
router.get('/download/excel', reportController.downloadExcel);  // Calls downloadExcel


module.exports = router;
