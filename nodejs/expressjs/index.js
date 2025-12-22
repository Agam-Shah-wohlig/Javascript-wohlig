const express = require("express")

const app = express();

app.get("/", (req, res) => {
    return res.send("This is the Homepage");
});

app.get("/about", (req, res) => {
    return res.send(`Hello, This is ${req.query.name}`);
});

app.listen(8000, () => console.log('Server started'));