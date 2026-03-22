import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config } from "./config";
import { presentationRoutes } from "./routes/presentationRoutes";
import { ensureOutputDir } from "./storage/fileStore";

const app = express();

ensureOutputDir();

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.use(presentationRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal Server Error",
  });
});

app.listen(config.port, () => {
  console.log(`PPT microservice is running on port ${config.port}`);
});
