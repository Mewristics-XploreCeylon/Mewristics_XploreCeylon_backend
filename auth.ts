import express, { Express, Request, Response } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: Request, res: Response, next: Function) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).send("Access denied");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send("Token has expired");
    }
    res.status(400).send("Invalid token");
  }
};

export default authenticate;
