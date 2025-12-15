const express = require("express");
const { connectMongoDB } = require("./utils/connection");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const productRouter = require("./routes/productRoutes");

const app = express();
const PORT = 8000;

// Set EJS
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(cookieParser());


// Connect to MongoDB
connectMongoDB("mongodb://localhost:27017/e-com")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/", authRouter);           // public
app.use("/user", userRouter);       // protected user routes
app.use("/admin", adminRouter);     // protected admin routes
app.use("/products", productRouter);// public or auth-protected products

app.listen(PORT, () => console.log(`Server Started at http://localhost:${PORT}`));
