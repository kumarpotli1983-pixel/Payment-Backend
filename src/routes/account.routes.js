import { verifyJWT } from "../middlewares/auth.middleware";
import { Account } from "../models/account.model.js";
import {createAccount} from "../controllers/account.controller.js"
import { Router } from "express";

const router = Router()
router.use(verifyJWT)

router.POST("/createAccount",createAccount)

export default router