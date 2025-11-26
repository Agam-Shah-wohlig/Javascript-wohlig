const express = require("express");
const users = require("./MOCK_DATA.json");
const fs = require("fs");

const app = express();
app.use(express.json());

app.get("/users", (req, res) => {
    return res.json(users);
});

app.get("/users/:id", (req, res) => {
    
    const id = Number(req.params.id);
    const gotUser = users.find((user) => user.id === id);

    if (gotUser){
        return res.send(gotUser);
    } else{
        return res.send(`No user with the id ${id} exists. Please pass correct ID in the URL`);
    }
});

app.post("/users", (req, res) => {

    const newId = users.length +1;
    const newUser = {id: newId, ...req.body};

    users.push(newUser);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, res) => {
        console.log("file written Succesfully");
    });
    return res.json(newUser);
});

app.patch("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const update_user = users.find((user) => user.id === id);
    if (update_user){

        for (let key in req.body) {

            if (update_user.hasOwnProperty(key)) {
                update_user[key] = req.body[key];
            }  
        }
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(update_user), (err, res) => {
        console.log("User Updated written Succesfully")});
    } else{
        return res.send(`No user with the id ${id} exists. Please pass correct ID in the URL`);
    }
    return res.json(update_user);
});

app.delete("/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(404).send(`No user with the id ${id} exists.`);
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, res) => {
        console.log("User Updated written Succesfully")
    });
    return res.json({
        message: `User with id ${id} deleted successfully.`,
        user: deletedUser
    });
});


app.listen(8000, () => console.log("Server started"));