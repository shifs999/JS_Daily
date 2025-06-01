// Js_004: Lets build our own REST API using Node and Express frameworks.

// The MOCK_DATA.json file used here is a JSON file that contains a list of 1000 users, to simulate a toy database. Location: Extra_Files/MOCK_DATA.json

// Visit  https://blog.postman.com/rest-api-examples/  to know what is REST API and how it works.

// Read the commented code as well for better understanding.

const express = require('express');
const app = express();
const port = 3000;
const users = require('./MOCK_DATA.json');
const fs = require('fs')

app.use(express.urlencoded({extended: false}));   // middleware used to parse the body/data, convert it to Js object, and add it to the req.body object.

app.get("/users", (req, res) =>{
  const html = `
  <ul>
  ${users.map((user) => `<li>${user.first_name}</li>`).join("")}
  </ul>
  `;
  res.send(html);
});     // if only   /users is used then it should render an html page

app.get("/api/users", (req, res) =>{    // if  /api/ is used then it should give the json data
  return res.json(users)    
// automatically converts the Js object, array, or other data passed to it into a JSON string. This process is called serialization.
});

// app.get("/api/user/:id", (req, res) =>{     // :id is a dynamic parameter
//   const id = Number(req.params.id);    // id is string so converted it to a number
//   const user = users.find((user) => user.id === id);
//   return res.json(user);
// });

// app.patch("/api/user/:id", (req, res) =>{ });

/* Suppose we want to add a new user to the MOCK_DATA.json file as, 
{
  "first_name": "Viktor",
  "last_name": "Reeves",
  "email": "vicrev123@gmail.com",
  "gender": "Male",
  "job_title": "SDE",
  "id": 1001 (don't give the id manually it will be handeled logically by handlers and will appear as a unique id in the updated file)
}   Postman API can be used to perform any kind of insertions and tests.*/
app.post("/api/users", (req, res) =>{
  const body = req.body;
  users.push({...body, id: users.length + 1});  // here we add our new user entry at the end of the array in MOCK_DATA.json file with a unique id
  // and  ...body is used to copy all the properties of body to the new object
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) =>{
    return res.json({status: "success", id: users.length});
  });
});

// --> For the above route "/api/user/:id", as they are same in both get and patch methods, we can use a clean code approach as below.

app.route("/api/user/:id").get((req, res) =>{
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user);
})
.patch((req, res)=>{
  const id = Number(req.params.id);
  const body = req.body;  // req.body holds the parsed JSON (or form data)
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return res.status(404).json({error: "User not found"});

  users[userIndex] = { ...users[userIndex], ...body };  // assign this merged object back into users[userIndex], so now our in-memory users array has the updated fields.
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) =>{
    if (err){
      return res.status(500).json({error: "Error writing to file"});
    }
    return res.json({status: "success", id});
  });
})
.delete((req, res)=>{
  const id = Number(req.params.id);
  const userIndex = users.findIndex((user) => user.id === id);
  if (userIndex === -1) return res.status(404).json({error: "User not found"});
  users.splice(userIndex, 1);
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) =>{
    if (err){
      return res.status(500).json({error: "Error writing to file"});
    }
    return res.json({status: "success", id});
    });
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
