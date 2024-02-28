const mongoose = require("mongoose");
const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cursonodejs.57bqbhs.mongodb.net/database?retryWrites=true&w=majority`;

const connectToDatabase = async () => {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.log(error);
  }
};
module.exports = connectToDatabase;