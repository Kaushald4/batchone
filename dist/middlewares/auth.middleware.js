"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = __importDefault(require("../models/user.schema"));
const asyncHandler_1 = __importDefault(require("../services/asyncHandler"));
const customError_1 = __importDefault(require("../utils/customError"));
const index_1 = __importDefault(require("../config/index"));
exports.isLoggedIn = (0, asyncHandler_1.default)(async (req, _res, next) => {
    let token;
    if (req.cookies.token ||
        (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookies.token || req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        throw new customError_1.default("NOt authorized to access this route", 401);
    }
    try {
        const decodedJwtPayload = jsonwebtoken_1.default.verify(token, index_1.default.JWT_SECRET);
        //_id, find user based on id, set this in req.user
        req.user = await user_schema_1.default.findById(decodedJwtPayload._id, "name email role");
        next();
    }
    catch (error) {
        throw new customError_1.default("NOt authorized to access this route", 401);
    }
});
