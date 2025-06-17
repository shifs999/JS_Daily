// Js_009: Let's understand how to use the MVC architecture to organize our code. MVC helps in allowing for efficient code reuse and the parallel development of the application.

/* MVC is a software design pattern that helps developers organize code by separating concerns into three distinct components: Model, View, and Controller. Each component has a specific role:

--> Model: The model represents the data and the business logic of the application. It handles data storage, retrieval, and manipulation, and interacts with the database or external APIs.

--> View: The view represents the user interface of the application. It handles the presentation of data to the user and receives input from the user.

--> Controller: The controller acts as the mediator between the model and the view. It receives input from the user via the view, interacts with the model to retrieve or manipulate data, and updates the view accordingly.

To read more about MVC visit: https://medium.com/@ipenywis/what-is-the-mvc-creating-a-node-js-express-mvc-application-da10625a4eda      (this page might be of some help.)
*/

// By separating concerns into these three components, we can create applications that are easier to maintain, scale, and test. MVC also encourages code reusability, which can lead to faster development cycles and more efficient use of resources.

const express = require("express");
const app = express();
const port = 3000;
const userRouter = require("./routes/user");
const { connectMongoDb } = require("./connection");
const { logReqRes } = require("./middlewares");


app.use(express.urlencoded({ extended: false }));

connectMongoDb("add your Mongo connection string here to connect and name your db").then(() =>
  console.log("MongoDB connected"));

app.use(logReqRes("log.txt"));

app.use("/api/users", userRouter);   // if any request comes from /api/users then use userRouter

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`),
);