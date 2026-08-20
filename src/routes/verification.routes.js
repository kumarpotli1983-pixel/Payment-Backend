import Router from "express"
import { verifyEmail } from "../controllers/verification.controller.js"

const router = Router()

router.post("/email/:token",verifyEmail)

export default router