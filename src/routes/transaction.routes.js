import { Router } from "express";
import { verifySystemUser, verifyUser } from "../middlewares/auth.middleware.js";
import { createInitialFundTransaction, createTransaction } from "../controllers/transaction.controller.js";

const router = Router();

router.post("/new-transaction",verifyUser,createTransaction)

router.post("/system/initial-funds",verifySystemUser,createInitialFundTransaction)

export default router