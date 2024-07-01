import express from "express";
['log', 'warn', 'error', 'info', 'debug'].forEach(function (method) {
  console[method] = function () {};
});
import databaseConnection from "./database/db.js";
import bodyParser from "body-parser";
import cors from "cors";
import botRoute from "./routes/botRoutes.js";
import statsRoute from "./routes/statsRoutes.js";
import adminRoute from "./routes/adminRoutes.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const Port = process.env.PORT;
const router = express.Router();

app.use("/", router);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Add the error log middleware to the app
app.use(cors({ origin: "*" }));

// Route Use Here
app.use("/bot", botRoute);
app.use("/stats", statsRoute);
app.use("/admin", adminRoute);

databaseConnection(() => {
  app.listen(Port, () => {
    console.log(`server listening on port ${Port}`);
  });
});

app.get("/testapi", async (req, res) => {
  console.log("req body", req?.body);
  res.send("server is active");
});

app.post("/testapi", async (req, res) => {
  console.log("req body", req?.body);
  res.send("server is active");
});
