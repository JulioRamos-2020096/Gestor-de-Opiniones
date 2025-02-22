import {Router} from "express";
import{
    updateUser,
    updatePassword,
} from "./user.controller.js"

import { updatePasswordValidator, 
    updateUserValidator} from "../middlewares/user-validators.js"

    const router = Router()

    router.patch("/updatePassword/:uid", updatePasswordValidator, updatePassword)

    router.put("/updateUser/:uid", updateUserValidator, updateUser)

export default router