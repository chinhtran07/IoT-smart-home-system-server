const mongoose = require("mongoose");
require("dotenv").config(".env");

// Định nghĩa các models
const User = require("../src/models/User");

// Kết nối với MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/smarthome")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


async function seedDatabase() {
  // const roleUser = new User({
  //   username: "chinhtran123",
  //   password: "123456",
  //   firstName: "Chinh",
  //   lastName: "Tran",
  //   email: "test@gmail.com",
  //   phone: "0123456789",
  //   role: "user",
  // });
  // await roleUser.save();

  const roleAdmin = new User({
    username: "admin",
    password: "123456",
    firstName: "Admin",
    lastName: "Admin",
    email: "admin@gmail.com",
    phone: "0986524123",
    role: "admin",
  });
  await roleAdmin.save();
}

seedDatabase();
