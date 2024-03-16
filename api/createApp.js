import express from "express";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";

export default function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cookieParser());

  app.use(routes);

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
