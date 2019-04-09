"use strict";
import { Application } from "express";
import { authRouter } from "./routes/index";

function ApiRouter(app: Application) {
  app.use("/api", authRouter);
}

export default ApiRouter;
