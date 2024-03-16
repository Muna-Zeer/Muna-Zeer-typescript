import { Response } from "express";

export const BadClientReq = (res: Response, message: string) => {
  return res.status(400).json({ message });
};

export const BadServerReq = (res: Response, error: any) => {
  console.log(error);
  return res.status(500).json({ message: "Internal Server error" });
};

export const SuccessUserReq = (res: Response, message: string) => {
  return res.status(200).json({ message });
};
