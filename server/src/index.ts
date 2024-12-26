import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { ServerRouter } from "./routes/router";
import { config } from "../env.config";
import cookieParser from "cookie-parser";
import handleError from "./utils/handleError";
import path from "path";

const app = express();
const serverPort = config.SERVER_PORT;
const clientPort = config.CLIENT_PORT;
const host = config.CLIENT_HOST;
app.use(express.json());

const corsOptions = {
  origin: host + ":" + clientPort,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../public")));

ServerRouter.setRouter(app);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  handleError.controllerError(res, err, "An unknown error occurred");
});

app.listen(serverPort, () => {
  console.log(`Server is running on port ${serverPort}...`);
});
