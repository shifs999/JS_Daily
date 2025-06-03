/*Js_007: Lets work on a task to allow users to sign up, then sign in, and then restrict access to view other users' data only if they are authenticated (i.e., signed in with a valid token).
We will use JWT for authentication, to learn more about JWT visit https://jwt.io/introduction

Lets say a user does signup with the required credentials and then /signin is performed with username: james@gmail.com and password: 123, then if the hashed password is matched a unique token is returned as: "randomxyzjwthashedtoken...", copy this token and paste it in the authorization header when making a get request on /users. 
We will get the data of all the users except james@gmail.com. */

const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");  // bcrypt is used for password hashing before storing it in db. To learn more about bcrypt, visit https://www.npmjs.com/package/bcrypt

const jwtPassword = "123456";  //secret key used by us to cryptographically sign the JWT(token), we can make it more complex and secure.

const app = express();
app.use(express.json());   // Middleware to parse JSON request bodies

mongoose.connect(`add your Mongo connection string here to connect and name your db`,
  { useNewUrlParser: true, useUnifiedTopology: true },
);

const User = mongoose.model("users", {
  name: String,
  username: String,
  password: String,
});


// Utility to check if a user exists in the DB
async function userExists(username) {
  const user = await User.findOne({ username });
  return user;
}

// POST /signup: Register a new user
app.post("/signup", async function (req, res) {
  const { name, username, password } = req.body;

  const existingUser = await userExists(username);
  if (existingUser) {
    return res.status(400).json({ msg: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);  // hashing the password before storing it in the db with 10 salt rounds

  const userDetails = new User({
    name,
    username,
    password: hashedPassword,
  });

  userDetails
    .save() // inserts into MongoDB
    .then((doc) =>
      res.status(201).json({ msg: "Signup successful", user: doc }),
    )
    .catch((err) => {
      console.error(err);
      res.status(500).json({ msg: "Error saving user, might try signing up with a different username"});
    });
});

// POST /signin: Log in a user and returns a unique JWT token on every successful signin
app.post("/signin", async function (req, res) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(403).json({ msg: "User doesn't exist in our database" });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);  // Compares the hashed password(made during signup)with the password provided by the user during signin 
  if (!isPasswordCorrect) {
    return res.status(403).json({ msg: "Incorrect password" });
  }

  const token = jwt.sign({ username }, jwtPassword);
  return res.json({ token });
});

// GET /users: Return list of other users if token is valid
app.get("/users", async function (req, res) {
  const token = req.headers.authorization;  // Extracting token from the request header

  if (!token) {
    return res.status(401).json({ msg: "Token required" });
  }

  try {
    const decoded = jwt.verify(token, jwtPassword);  // Verifying the token with the help of secret key
    const currentUsername = decoded.username;

    const allUsers = await User.find({});
    const otherUsers = allUsers.filter(
      (user) => user.username !== currentUsername,
    );

    res.status(200).json({ users: otherUsers });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
