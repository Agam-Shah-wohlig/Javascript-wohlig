// Imports
const express = require("express");
const {connectMongoDB} = require("./utils/connection")

// import routes
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
const productRouter  = require("./routes/productRoutes");

const app = express();
const PORT = 8000;

const seedProducts = require("./utils/generate_test_data");
const seedCategoriesAndBrands = require("./utils/seedCategoryAndBrand");


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


// seedProducts();
// seedCategoriesAndBrands();

// routes
app.use("/", adminRouter);
app.use("/", userRouter);
app.use("/", productRouter);



app.listen(PORT, () => console.log("Server Started at http://localhost:8000"));