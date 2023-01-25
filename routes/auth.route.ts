import express from "express";
const router = express.Router();

import { isLoggedIn } from "../middlewares/auth.middleware.js";
import {
    signUp,
    forgotPassword,
    getProfile,
    login,
    logout,
    resetPassword,
    changePassword,
} from "../controllers/auth.controller";

router.post("/auth/signup", signUp);
router.post("/auth/login", login);
router.put("/auth/password/forgot", forgotPassword);
router.put("/auth/password/reset/:token", resetPassword);
router.put("/auth/password/change", isLoggedIn, changePassword);
router.get("/auth/profile", isLoggedIn, getProfile);
router.get("/auth/logout", isLoggedIn, logout);

export default router;
