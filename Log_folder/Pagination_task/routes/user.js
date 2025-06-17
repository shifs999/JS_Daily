const express = require("express");
const router = express.Router();
const User = require("../models/user");

// GET /api/users?page=1&limit=5&gender=Male&search=John&sortBy=age&sortOrder=desc

router.get("/", async (req, res) => {
  try {
    // page: which page to display and limit: how many users per page (default is 3 here)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit; // how many users to skip for pagination. (for eg. page 2 skips 3 users)

    const {
      gender,
      status,
      search,
      sortBy = "first_name",
      sortOrder = "asc",
    } = req.query; // Extracts other optional filters from the query parameters

    // Build filter object
    const filter = {};
    if (gender) filter.gender = gender;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { first_name: { $regex: search, $options: "i" } },
        { last_name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Sort config
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Fetch data
    const users = await User.find(filter)
      .sort(sortConfig)
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(filter);

    res.status(200).json({
      page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      results: users,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

module.exports = router;
