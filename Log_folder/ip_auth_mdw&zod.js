// Cool way of doing input validation using mdw and zod.
const zod = require("zod"); 
const express = require("express");
const app = express();

const schema = zod.array(zod.number()); // zod schema is any kind of data type 
//app.use(express.json())  // this is a middleware that parses the body of the request and converts it into a json object.
//app.post("/hlth_chkup", (req, res)=>{
    // input kidneys is expected as an array.
    //const kidneys = req.body.kidneys;  // this is the body of the request which will be parsed by middleware.
    const response = schema.safeParse(kidneys);  // this is the response of the schema.
    res.send({response})
    //const kidney_length = kidneys.length;
    //res.send("Kidney length is " + kidney_length) });

const validate = (arr) => {       // a function to validate the input.
    const schema = zod.array(zod.number());
    const response = schema.safeParse(arr);
    console.log(response);
}
validate([1, 2, 3]);

const validate_login = (obj) => {  // a function to validate the login credentials.
    const schema2 = zod.object({
        email: zod.string().email(),
        password: zod.string().min(8)
    }); 
    const response2 = schema2.safeParse(obj);
    console.log(response2);
}
validate_login({email: "abc@gmail.com", password: "12345678"});


app.post("/login",(req, res) => {
    const response = req.body;
    if (!response.success){
        res.json({
            msg: "Login failed, invalid input"
        });
    }
})

// global error handler/catches(4 args) if there is an exception for any of the route.
// app.use((err, req, res, next)=>{
//     res.send("An error has occured")
// })


app.listen(3000);
