import { Router } from "express";
import { resetPassword } from "../controllers/password.controller.js";

const router = Router()

router.patch("/:token",resetPassword)

export default router