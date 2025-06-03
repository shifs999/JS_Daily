// Js_006: Lets understand how to define a schema, connect to a MongoDB database, and perform CRUD operations on a collection.

// Please go through Js_004 for references and better understanding. Last time in Js_004 we used a MOCK_DATA.json file for simplicity, but this time we will perform the opertions on a DB.

// Visit  https://www.mongodb.com/resources/products/fundamentals/basics  and  https://mongoosejs.com/docs/  to learn about MongoDB and Mongoose.

const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const mongoose = require("mongoose");

// Connect to MongoDB
mongoose
  .connect(
    "add your Mongo connection string here to connect and name your db",
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB Error", err));

// Define a schema and model for the users collection

const userSchema = new mongoose.Schema(      // we have to create a schema in Mongoose to define the structure of data in our users collection
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      required: true,
    },
    job_title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("user", userSchema);    // A model lets us interact with the collection in MongoDB using the schema, here User is our model instance which helps us to interact.
//  Here, user is our collection which is created internally but its name will be lowercased + pluralized automatically

app.use(express.urlencoded({ extended: false }));

app.get("/users", async (req, res) => {
  const allDbUsers = await User.find({});       // all entries in db will be displayed on the page
  const html = `
  <ul>
  ${allDbUsers.map((user) => `<li>${user.first_name} - ${user.gender} - ${user.email}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});

app.get("/api/users", async (req, res) => {
  const allDbUsers = await User.find({});
  return res.json(allDbUsers);
});

/* Suppose we want to add a new entry to our users collection, 
{
  "first_name": "Viktor",
  "last_name": "Reeves",
  "email": "vicrev123@gmail.com",
  "gender": "Male",
  "job_title": "SDE",
}   Postman API can be used to perform any kind of requests, insertions and tests.*/
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  await User.create({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    gender: body.gender,
    job_title: body.job_title,
  });
  return res.status(201).json({ msg: "success" });
});

app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const user_id = await User.findById(req.params.id);
    return res.json(user_id);
  })
  .patch(async (req, res) => {
    // Try writing patch request by yourself as an exercise.
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id)
      return res.json({ status: "success", id });
    });

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);
