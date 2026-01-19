import cors from "cors";
import express from "express";
import morgan from "morgan";
import routeHandler from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
const app = express();

// allow server to receive and parse JSON
app.use(express.json());

// allow all cors (just in case)
app.use(cors());

// use morgan for better responses in terminal
app.use(morgan("dev"));

// send a 200 json response to the client at /
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "Server is up and running.",
        success: true,
    });
});

// setup api routes
app.use("/v1", routeHandler);

// setup error handler middleware
app.use(errorHandler);

// start the server and send a terminal response on port 8080
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
