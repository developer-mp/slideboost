import path from "path";

export const config = {
  port: Number(process.env.PPT_SERVICE_PORT ?? 4010),
  outputDir: path.resolve(process.cwd(), "output"),
};
