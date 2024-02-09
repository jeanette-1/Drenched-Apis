const express = require("express");
const app = express();

const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const PORT = process.env.PORT || 8080;
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const listRouter = require("./routes/list");
const favoriteRouter = require("./routes/favorite");
dotenv.config();
//CONNECT MONGODB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb databse is ready to use 🚀🚀");
  });
//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//routes

//baseurl: /drenched/api
app.use("/drenched/api/auth", authRouter);
app.use("/drenched/api/category", categoryRouter);
app.use("/drenched/api/list", listRouter);
app.use("/drenched/api/favorite", favoriteRouter);
app.use("/drenched/api", (req, res) => {
  res.send({ message: "apis are ready to use" });
});

app.listen(PORT, () => {
  console.log("Apis are working on port", PORT);
});
