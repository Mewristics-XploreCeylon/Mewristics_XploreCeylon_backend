import { Router, Request, Response } from "express";
import User from "../models/user";
import authenticate from "../auth";
import VisaApplication from "../models/visa_app";

const router = Router();

router.post("/visa_app", authenticate, async (req: Request, res: Response) => {
  let user: any
  try {
    user = await User.findById((req as any).user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }

  user = user!

  let visaApp = await VisaApplication.findOne({ user: user._id });
  
  const visaAppData = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v != null)
  );

  if (!visaApp) {
    visaApp = new VisaApplication({ ...visaAppData, user: user._id });
    await visaApp.save();
    res.status(201).json(visaApp);
  } else {
    visaApp = await VisaApplication.findOneAndUpdate({ user: user._id }, visaAppData, { new: true });
    res.status(200).json(visaApp);
  }
});

router.get("/visa_app", authenticate, async (req: Request, res: Response) => {
  let user: any
  try {
    user = await User.findById((req as any).user.userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send("Error retrieving user");
  }

  user = user!

  let visaApp = await VisaApplication.findOne({ user: user._id });

  if (!visaApp) {
    visaApp = await VisaApplication.create({ user: user._id });
  }
  
  res.status(200).json(visaApp);
});

export default router;