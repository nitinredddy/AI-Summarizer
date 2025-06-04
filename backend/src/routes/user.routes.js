import { Router } from "express";
import { afterSignUp, login, signup } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/signup").post(signup)
router.route("/login").post(login)


router.route("/details").post(verifyJWT,afterSignUp)


export default router