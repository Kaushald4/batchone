import mongoose from "mongoose";
import app from "./app";
import config from "./config/index";

(async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(config.MONGODB_URL);
        console.log("DB CONNECTED");

        app.on("error", (err) => {
            console.log("ERROR: ", err);
            throw err;
        });

        const onListening = () => {
            console.log(`Listening on ${config.PORT}`);
        };

        app.listen(config.PORT, onListening);
    } catch (err) {
        console.log("ERROR ", err);
        throw err;
    }
})();
