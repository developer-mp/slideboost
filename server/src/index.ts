import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { ServerRouter } from "./routes/router";
import { config } from "../env.config";
import cookieParser from "cookie-parser";
import handleError from "./utils/handleError";

const app = express();
const port = config.SERVER_PORT;
app.use(express.json());

const corsOptions = {
  origin: config.CLIENT_HOST + ":" + config.CLIENT_PORT,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

ServerRouter.setRouter(app);

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  handleError.controllerError(res, err, "An unknown error occurred");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
