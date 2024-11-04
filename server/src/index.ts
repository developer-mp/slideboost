import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ServerRouter } from "./routes/router";
import { config } from "../env.config";

const app = express();
const port = config.SERVER_PORT;
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

ServerRouter.setRouter(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
