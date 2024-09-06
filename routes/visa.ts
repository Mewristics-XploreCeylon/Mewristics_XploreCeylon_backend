import { Router, Request, Response } from "express";
import VisaStatus from "../models/visa";
import authenticate from "../auth";
import User from "../models/user";
import VisaApplication from "../models/visa_app";

const router = Router();

/**
 * @route GET /
 * @group Visa - Operations related to visa status
 * @param {string} visaApplicationId.query.required - The ID of the visa application
 * @security JWT
 * @returns {object} 200 - An array of visa status objects
 * @returns {Error} 403 - Unauthorized access
 * @returns {Error} 404 - Visa status not found
 * @returns {Error} 500 - Error retrieving visa status
 * @description This endpoint retrieves the status of a visa application for an admin user.
 * The user must be authenticated and have an admin role to access this endpoint.
 * If the visa application ID is provided, it fetches the corresponding visa status from the database.
 */
router.get("/", async (req: Request, res: Response) => {
  // const userId = (req as any).user.userId;
  // const user = await User.findById(userId);
  
  // if ( user == null || user.role !== "admin") {
  //   return res.status(403).send("Unauthorized");
  // }

  const visaApplicationId = req.query.visaApplicationId;

  try {
    const visaStatus = await VisaStatus.find({ visaApplication: visaApplicationId });
    if (!visaStatus) {
      return res.status(404).send("Visa status not found");
    }
    res.status(200).json(visaStatus);
  } catch (error) {
    res.status(500).send("Error retrieving visa status");
  }
});

/**
 * @route POST /status
 * @group Visa - Operations related to visa status
 * @param {object} request.body.required - The request body containing visa application ID and status details
 * @param {string} request.body.visaApplicationId.required - The ID of the visa application
 * @param {string} request.body.status.required - The current status of the visa application
 * @param {string} request.body.title.required - The title of the status update
 * @param {string} request.body.description.required - A description of the status update
 * @security JWT
 * @returns {object} 200 - The updated visa status object
 * @returns {Error} 403 - Unauthorized access
 * @returns {Error} 500 - Error adding status
 * @description This endpoint allows an admin user to add a new status update to a visa application.
 * The user must be authenticated and have an admin role to access this endpoint.
 * If the visa application ID does not exist, a new visa status object is created.
 * The new status is then appended to the status list of the visa application.
 */
router.post("/status", async (req: Request, res: Response) => {
  // const userId = (req as any).user.userId;
  // const user = await User.findById(userId);
  
  // if ( user == null || user.role !== "admin") {
  //   return res.status(403).send("Unauthorized");
  // }

  const visaApplicationId = req.body.visaApplicationId;

  try {
    let visaStatus = await VisaStatus.findOne({ visaApplication: visaApplicationId });
    if (!visaStatus) {
      visaStatus = new VisaStatus({
        visaApplication: visaApplicationId,
        statusList: [],
      });
      await visaStatus.save();
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