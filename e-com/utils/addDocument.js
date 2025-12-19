const mongoose = require("mongoose");
const Address = require("../models/address"); // your address model file

// 1. Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/yourDBName", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// 2. Insert the first address
async function insertAddress() {
  const newAddress = new Address({
    user: "64f123456789abcdef000001",
    label: "Home",
    fullName: "John Doe",
    phone: "+1234567890",
    street: "123 Main Street",
    city: "Springfield",
    state: "Illinois",
    postalCode: "62704",
    country: "USA"
  });

  const savedAddress = await newAddress.save();  // 🔑 collection created here
  console.log("Address inserted:", savedAddress);
  mongoose.connection.close();
}

module.exports = insertAddress;
