import { Request } from "express";

export const logRequest = (req: Request) => {
  console.log(`[${req.method}] - ${req.url}`);
};
