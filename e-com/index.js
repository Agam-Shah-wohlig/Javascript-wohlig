// Imports
const express = require("express");
const {connectMongoDB} = require("./utils/connection")

// import routes
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes")

const app = express();
const PORT = 8000;



// Set EJS
app.set("view engine", "ejs");
app.set("views", "./views");


//Connection to MongoDB
connectMongoDB("mongodb://localhost:27017/e-com")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log(err));


//Inbuilt Middleware 
app.use(express.urlencoded({ extended: true })); // For form-urlencoded data
app.use(express.json());
app.use(express.static("public"));




// routes
app.use("/", adminRouter);
app.use("/", userRouter);


app.listen(PORT, () => console.log("Server Started at http://localhost:8000"));