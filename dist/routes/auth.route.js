"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_middleware_js_1 = require("../middlewares/auth.middleware.js");
const auth_controller_1 = require("../controllers/auth.controller");
router.post("/auth/signup", auth_controller_1.signUp);
router.post("/auth/login", auth_controller_1.login);
router.put("/auth/password/forgot", auth_controller_1.forgotPassword);
router.put("/auth/password/reset/:token", auth_controller_1.resetPassword);
router.put("/auth/password/change", auth_middleware_js_1.isLoggedIn, auth_controller_1.changePassword);
router.get("/auth/profile", auth_middleware_js_1.isLoggedIn, auth_controller_1.getProfile);
router.get("/auth/logout", auth_middleware_js_1.isLoggedIn, auth_controller_1.logout);
exports.default = router;
