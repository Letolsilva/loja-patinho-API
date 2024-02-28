const mongoose = require("mongoose");
const Product = require("./productsModel");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  userName: String,
  password: String,
  role: String,
  productHistory: [Product.schema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
