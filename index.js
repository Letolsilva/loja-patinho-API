const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/userRoutes");
const productsRoute = require("./routes/productsRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/", authRoute);
app.use("/", productsRoute);

const connectToDatabase = require("./src/database");

connectToDatabase();

app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
app.get("/status", (req, res) => {
  const status = {
    Status: "Running",
  };
  res.send(status);
});
