// Js_010: Lets go through the task of creating a URL shortener.
// URL shortener is a tool that transforms a long, complex web address (URL) into a shorter, more manageable one. Shorter URLs are easier to share, especially on social media or in print where space is limited. They also help to track the performance of links by providing analytics on how many times they have been clicked.

const express = require("express");
const port = 3000;
const urlRoute = require("./routes/url");
const { connectToMongoDB } = require("./connect");
const app = express();
const URL = require("./models/url")

connectToMongoDB("mongoDB connection string").then(() =>
console.log("MongoDB connected"));  

app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res)=>{
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),    // tracking the time when the url is visited, keeping the history
        },
      },
    }
  );
  res.redirect(entry.redirectURL)
})

app.listen(port, () => 
  console.log(`Server running on port: ${port}`));
