import dotenv from "dotenv";
dotenv.config();
import App from "./createApp.js";
import { connectMongoDB } from "./configs/mongoDBConnect.js";
import mongoose from "mongoose";

connectMongoDB();

const app = App();

const PORT = process.env.PORT || 3000;

mongoose.connection.once("open", () => {
  console.log("Connected to Database");
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
