import { verifyUser } from "../middlewares/auth.middleware.js";
import { Account } from "../models/account.model.js";
import {createAccount, getUserAccount, getUserAccountBalance} from "../controllers/account.controller.js"
import { Router } from "express";

const router = Router()
router.use(verifyUser)

router.post("/createAccount",createAccount)

router.get("/details",getUserAccount)

router.get("/balance/:accountId",getUserAccountBalance)

export default router