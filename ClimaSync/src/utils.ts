import { Request } from "express";

export const logRequest = (req: Request) => {
  let msg = `[${req.method}] ${new Date()} - ${req.url}`;
  if (req.body) msg = `${msg} - body: ${JSON.stringify(req.body)}`;

  console.log(msg);
};
