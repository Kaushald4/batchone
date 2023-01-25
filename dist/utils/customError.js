"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, code) {
        super(message);
        this.code = 500;
        this.code = code;
    }
}
exports.default = CustomError;
