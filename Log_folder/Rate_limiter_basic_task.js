/* Js_008: Lets implement a basic rate limiter, a way to prevent a user from making too many requests within a short amount of time.
Creating a global middleware which will rate limit the requests from user to only 5 requests/sec. If no. of req. > 5 req/sec give error message.
Users will be sending in their user id in the header as 'user-id'.*/

const express = require("express");
const app = express();

let numberOfRequestsForUser = {};  // An in-memory object that keeps track of how many requests each user has made within a 1-second time window

setInterval(() => {       // This effectively creates a 1 second sliding window for counting requests. That means every second, users get a fresh start so their request count is reset to 0.
  numberOfRequestsForUser = {};
}, 1000);

// Rate limiting middleware
app.use((req, res, next) => {
  const userId = req.headers["user-id"];

  if (!userId) {
    return res.status(400).send("User ID header missing");
  }

  if (numberOfRequestsForUser[userId]) {
    numberOfRequestsForUser[userId] += 1;   // If user has already made a request this second, increase their request count by 1

    if (numberOfRequestsForUser[userId] > 5) {
      return res.status(429).send("Too many requests. No entry.");
    }
  } else {
    numberOfRequestsForUser[userId] = 1;  // If user is making their first request this second, initialize their count to 1
  }

  next();
});

app.get("/", (req, res) => {
  res.send("Request accepted");
});
app.listen(3000, () => console.log("Server running on port 3000"));
