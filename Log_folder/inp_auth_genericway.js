// Uncool way of doing input validation and authentication.

const express = require("express");
const app = express();
app.get("/hlth_chkup", (req, res)=>{
    const username = req.headers.username;
    const password = req.headers.password;
    const kidney_id = req.query.kidney_id;

if (username != "xyz" || password != "pass"){
    res.status(400).json({
        msg: "Your inputs are invalid."
    })
}

if (kidney_id != 1 && kidney_id != 2){
    res.status(400).json({
        msg: "Your query is invalid."
    })
}

res.json({msg: "Fine"});

});

app.listen(3000);
