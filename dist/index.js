"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const index_1 = __importDefault(require("./config/index"));
(async () => {
    try {
        mongoose_1.default.set("strictQuery", false);
        await mongoose_1.default.connect(index_1.default.MONGODB_URL);
        console.log("DB CONNECTED");
        app_1.default.on("error", (err) => {
            console.log("ERROR: ", err);
            throw err;
        });
        const onListening = () => {
            console.log(`Listening on ${index_1.default.PORT}`);
        };
        app_1.default.listen(index_1.default.PORT, onListening);
    }
    catch (err) {
        console.log("ERROR ", err);
        throw err;
    }
})();
