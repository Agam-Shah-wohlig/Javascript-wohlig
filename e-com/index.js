const express = require("express");
const { connectMongoDB } = require("./utils/connection");
const cookieParser = require("cookie-parser");


// Import Routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const productRouter = require("./routes/productRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const checkoutRouter = require("./routes/checkoutRoutes");

//Import custom Middlewares
const authMiddleware = require("./middlewares/authMiddleware");


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

// Custom Middlewares
app.use(authMiddleware);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// const insertAddress = require("./utils/addDocument");
// insertAddress();

// Connect to MongoDB
connectMongoDB("mongodb://localhost:27017/e-com")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/", userRouter);           // public
app.use("/auth", authRouter);       // protected user routes
app.use("/admin", adminRouter);     // protected admin routes
app.use("/products", productRouter);// public or auth-protected products
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/checkout", checkoutRouter);


app.listen(PORT, () => console.log(`Server Started at http://localhost:${PORT}/homepage`));
