import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "./config";

import { limiter } from "./middlewares/rate-limit.middleware";
import { connectToRedis } from "./config/redis";
import { proxyServices } from "./config/services";
import http from "http";

const app = express();

app.use(helmet());
app.use(cors());
app.use(limiter);

// health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.json({ healthCheck: "ok" });
});

// service routes

proxyServices(app);

const startServer = async () => {
  try {
    await connectToRedis().then(() => {
      app.listen(config.PORT, () => {
        console.log(`${config.SERIVCE_NAME} running on port : ${config.PORT}`);
      });
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
