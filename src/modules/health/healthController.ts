import { Request, Response } from "express";
import { checkDbHealth } from "../../utils/dbHealth";

export const getHealth = (req: Request, res: Response) => {
  const dbStatus = checkDbHealth();

  res.json({
    status: "Ok",
    databse: dbStatus ? "Connected" : "Disconnected",
  });
};
