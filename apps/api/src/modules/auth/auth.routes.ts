import { Router } from "express";

import { authenticate } from "../../core/middlewares/authenticate.js";
import { authorize } from "../../core/middlewares/authorize.js";
import { getMe } from "./auth.controller.js";

export const authRouter = Router();

authRouter.get("/me", authenticate, authorize(), getMe);
