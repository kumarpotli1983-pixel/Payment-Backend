import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";

const router = Router();

router.use(verifyJWT)

router.POST("/new Transaction",createTransaction)

export default router