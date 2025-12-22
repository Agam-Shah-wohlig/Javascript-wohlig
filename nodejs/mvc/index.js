const express = require("express")
//import connection function
const {connectMongoDB} = require("./connection");

//import routes function
const userRouter = require("./routes/user");

//import log function
const {logReqRes} = require("./middlewares")

const app = express();
const PORT = 8000;

//Connection to MongoDB
connectMongoDB("mongodb://localhost:27017/mongodb-tutorial")
.then(() => console.log("MongoDb Connected"));

//Inbuilt Middleware 
app.use(express.urlencoded({ extended: true })); // For form-urlencoded data
app.use(express.json());
app.use(logReqRes("log.txt"));


//Routes
app.use("/users", userRouter);


// Run the Server!
app.listen(PORT, () => console.log("Server Started"));
