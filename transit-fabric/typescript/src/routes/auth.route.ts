"use strict";

import { Router } from "express";
import { auth } from "../middlewares/auth.middleware";
import {invokeTrans, login, logout, searchTrans} from "../controllers/auth.contr";
const authRouter = Router();

authRouter.post("/login", login);
authRouter.get("/logout", auth(), logout);
authRouter.post("/invokeTrans", invokeTrans);
authRouter.get("/searchTrans", searchTrans);

export default authRouter;
