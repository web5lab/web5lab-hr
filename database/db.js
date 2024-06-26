import mongoose from "mongoose";
const mongodbUri =
  "mongodb+srv://shiva:77395644@cluster0.qz60sng.mongodb.net/minerdoge-beta";

const databaseConnection = function (callback) {
  mongoose
    .connect(mongodbUri)
    .then((res) => {
      console.log("database connected");
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

export default databaseConnection;
