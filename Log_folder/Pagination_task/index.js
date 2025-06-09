/* Js_011: Lets implement a basic pagination and filtering task.

Pagination is the process of dividing content or data into discrete pages. It's a common technique used in web and app interfaces when displaying a large dataset like search results, product listings, or user comments to improve performance and user experience.

We have seen pagination in UI look somewhat like this:
https://img.uxcel.com/practices/when-to-use-pagination-1724160216201/a-1724160216201-2x.jpg

To read more about pagination, you can refer to this resource: 
https://javascript.plainenglish.io/pagination-in-web-development-what-it-is-why-it-matters-and-the-types-you-should-know-b003fb3ce78e

Here, in our case, user data is split into manageable pages using query parameters like page and limit, enabling efficient retrieval of results. Filtering is supported via a search parameter, which performs a case-insensitive match on first name, last name, or email fields.*/

const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const User = require("./models/user");

const app = express();
const userRoutes = require("./routes/user");

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.post("/api/users", async (req, res) => {
  try {
    const { first_name, last_name, email, gender, job_title, status } =
      req.body;

    const newUser = new User({
      first_name,
      last_name,
      email,
      gender,
      job_title,
      status,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "User creation failed", details: err.message });
  }
}); // Postman can be used to send a post req and create a user

app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
