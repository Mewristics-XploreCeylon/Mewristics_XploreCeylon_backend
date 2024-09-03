import { Router, Request, Response } from "express";
import VisaStatus from "../models/visa";
import authenticate from "../auth";

const router = Router();

router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const visaStatus = await VisaStatus.find({ visaApplication: (req as any).user.userId });
    if (!visaStatus) {
      return res.status(404).send("Visa status not found");
    }
    res.status(200).json(visaStatus);
  } catch (error) {
    res.status(500).send("Error retrieving visa status");
  }
});

router.post("/", authenticate, async (req: Request, res: Response) => {
  try {
    const visaStatus = new VisaStatus({
      visaApplication: (req as any).user.userId,
      statusList: [],
    });
    await visaStatus.save();
    res.status(201).json(visaStatus);
  } catch (error) {
    res.status(500).send("Error creating visa status");
  }
});

router.post("/status", authenticate, async (req: Request, res: Response) => {
  try {
    const visaStatus = await VisaStatus.findOne({ visaApplication: (req as any).user.userId });
    if (!visaStatus) {
      return res.status(404).send("Visa status not found");
    }
    visaStatus.statusList.push({
      status: req.body.status,
      title: req.body.title,
      description: req.body.description,
      updatedAt: new Date(),
    });
    await visaStatus.save();
    res.status(200).json(visaStatus);
  } catch (error) {
    res.status(500).send("Error adding status");
  }
});

export default router;
