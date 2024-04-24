import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
import { corsOptions } from "./configs/corsOptions.js";

export default function createApp() {
  const __dirname = path.resolve();
  const app = express();
  app.use(cors(corsOptions));

  app.use(express.json());

  app.use(cookieParser());

  app.use(routes);

  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });

  app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).send({
      success: false,
      statusCode,
      message,
    });
  });

  return app;
}
