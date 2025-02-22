import { Router } from "express";
import { register, login, changePassword } from "./auth.controller.js";
import { registerValidator, loginValidator, passwordChangeValidator } from "../middlewares/user-validators.js";

const router = Router();


router.post("/register", registerValidator, register);


router.post("/login", loginValidator, login);

router.post("/change-password", passwordChangeValidator, changePassword);

export default router;