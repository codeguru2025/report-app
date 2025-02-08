const Report = require('../models/Reports');  // Assuming you're using a Report model to fetch the data

// Display all reports with optional filtering by startDate, endDate, and team
exports.viewReports = async (req, res) => {
  try {
    const { startDate, endDate, team } = req.query;

    // Build the query object based on user input
    let query = {};
    if (startDate) query.date = { $gte: new Date(startDate) };
    if (endDate) query.date = { ...query.date, $lte: new Date(endDate) };
    if (team) query.team = new RegExp(team, 'i'); // Case-insensitive search for team

    // Get the filtered reports from the database
    const reports = await Report.find(query).sort({ date: -1 }); // Sort reports by date, latest first

    // Send reports to the front-end with the necessary date formatting function
    res.render('view-reports', {
      reports,
      filters: { startDate, endDate, team },  // Pass the filters for the view to handle
      formatDate: (date) => new Date(date).toLocaleDateString(), // Helper function to format dates
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving reports");
  }
};

// Generate data for the dashboard (aggregated data for appointments and presentations per team)
exports.dashboard = async (req, res) => {
  try {
    // Aggregate data for the dashboard (e.g., total appointments and presentations per team)
    const teamData = await Report.aggregate([
      { 
        $group: { 
          _id: "$team", 
          totalAppointments: { $sum: "$appointments" }, 
          totalPresentations: { $sum: "$presentations" } 
        } 
      },
      { $sort: { _id: 1 } } // Sort teams alphabetically
    ]);

    // Prepare data for the charts on the dashboard
    const reportData1 = {
      labels: teamData.map(item => item._id),  // Team names
      values: teamData.map(item => item.totalAppointments)  // Total appointments per team
    };

    const reportData2 = {
      labels: teamData.map(item => item._id),  // Team names
      values: teamData.map(item => item.totalPresentations)  // Total presentations per team
    };

    // Render the dashboard with the aggregated data
    res.render('dashboard', { reportData1, reportData2 });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving dashboard data");
  }
};

// Additional routes for downloading reports (PDF & Excel)
exports.downloadPDF = async (req, res) => {
  try {
    // Placeholder for actual PDF download logic
    res.send("PDF download functionality");
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
};

exports.downloadExcel = async (req, res) => {
  try {
    // Placeholder for actual Excel download logic
    res.send("Excel download functionality");
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).send("Error generating Excel");
  }
};
