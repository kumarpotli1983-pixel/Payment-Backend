import { verifyUser } from "../middlewares/auth.middleware.js";
import { Account } from "../models/account.model.js";
import {createAccount} from "../controllers/account.controller.js"
import { Router } from "express";

const router = Router()
router.use(verifyUser)

router.post("/createAccount",createAccount)

export default router