import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ServerRouter } from "./routes/router";
import { config } from "../env.config";
import cookieParser from "cookie-parser";

const app = express();
const port = config.SERVER_PORT;
app.use(bodyParser.json());
app.use(express.json());

const corsOptions = {
  origin: config.CLIENT_HOST + ":" + config.CLIENT_PORT,
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

ServerRouter.setRouter(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
