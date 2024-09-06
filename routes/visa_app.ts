import { Router, Request, Response } from "express";
import User from "../models/user";
import authenticate from "../auth";
import VisaApplication from "../models/visa_app";
import { UploadedFile } from "express-fileupload";
import fs from "fs";

const router = Router();

/**
 * @route POST /
 * @group Visa Application - Operations related to visa applications
 * @param {object} request.body.required - The request body containing visa application data
 * @param {string} request.body.passportImage.required - The passport image file
 * @param {string} request.body.fingerprint.required - The fingerprint image file
 * @security JWT
 * @returns {object} 200 - The updated visa application object
 * @returns {Error} 403 - Unauthorized access
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Error retrieving user
 * @description This endpoint allows a user to submit their passport and fingerprint images for a visa application.
 * The user must be authenticated to access this endpoint.
 * If the user is not found, it returns a 404 error.
 * The passport and fingerprint images are saved to the user's directory.
 * The visa application data is then updated or created in the database.
 */
router.post("/", authenticate, async (req: Request, res: Response) => {
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
  
  const visaAppData = Object.fromEntries(
    Object.entries(req.body).filter(([_, v]) => v != null)
  );

  if (req.files) {
    if (req.files.passportImage) {
      let passportImage = req.files.passportImage as UploadedFile
      const uploadPath = __dirname + `/images/${user._id}_passport_image.png`;
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
      passportImage.mv(uploadPath, function(err: any) {
        if (err)
          return res.status(500).send("Failed to save passport image: " + err);
      });
      visaAppData.passportImage = uploadPath;
    }
    if (req.files.fingerprint) {
      let fingerprint = req.files.fingerprint as UploadedFile
      const uploadPath = __dirname + `/images/${user._id}_fingerprint.png`;
      if (fs.existsSync(uploadPath)) {
        fs.unlinkSync(uploadPath);
      }
      fingerprint.mv(uploadPath, function(err: any) {
        if (err)
          return res.status(500).send("Failed to save fingerprint: " + err);
      });
      visaAppData.fingerprint = uploadPath;
    }
  }

  if (!visaApp) {
    visaApp = new VisaApplication({ ...visaAppData, user: user._id });
    await visaApp.save();
    res.status(201).json(visaApp);
  } else {
    visaApp = await VisaApplication.findOneAndUpdate({ user: user._id }, visaAppData, { new: true });
    res.status(200).json(visaApp);
  }
});

/**
 * @route GET /
 * @group Visa Application - Operations related to visa applications
 * @security JWT
 * @returns {object} 200 - The visa application object
 * @returns {Error} 403 - Unauthorized access
 * @returns {Error} 404 - User not found
 * @returns {Error} 500 - Error retrieving user
 * @description This endpoint retrieves the visa application for a user.
 * The user must be authenticated to access this endpoint.
 * If the user is not found, it returns a 404 error.
 * The visa application is retrieved from the database.
 * Image are sent as path files, so the client needs to fetch them from the server by calling the /images GET route.
 */
router.get("/", authenticate, async (req: Request, res: Response) => {
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

/**
 * @route GET /images
 * @group Visa Application - Operations related to visa applications
 * @param {string} imagePath.query.required - The path to the image file
 * @returns {object} 200 - The image file
 * @returns {Error} 400 - Image path is required
 * @returns {Error} 404 - Image not found
 * @description This endpoint retrieves an image file from the server.
 * The image path is provided as a query parameter.
 * If the image path is not provided, it returns a 400 error.
 * If the image file does not exist, it returns a 404 error.
 * Otherwise, it sends the image file to the client.
 */
router.get("/images", async (req: Request, res: Response) => {
  const imagePath = req.body.imagePath
  if (!imagePath) {
    return res.status(400).send("Image path is required");
  }
  if (!fs.existsSync(imagePath)) {
    return res.status(404).send("Image not found");
  }
  res.sendFile(imagePath);
})

/**
 * @route GET /applications
 * @group Visa - Operations related to visa applications
 * @security JWT
 * @returns {object} 200 - An array of visa application objects
 * @returns {Error} 403 - Unauthorized access
 * @returns {Error} 404 - Visa applications not found
 * @returns {Error} 500 - Error retrieving visa applications
 * @description This endpoint retrieves all visa applications for an admin user.
 * The user must be authenticated and have an admin role to access this endpoint.
 * If no visa applications are found, it returns a 404 error.
 */
router.get("/applications", async (req: Request, res: Response) => {
  // const userId = (req as any).user.userId;
  // const user = await User.findById(userId);
  
  // if ( user == null || user.role !== "admin") {
  //   return res.status(403).send("Unauthorized");
  // }

  try {
    const visaApplications = await VisaApplication.find();
    if (!visaApplications) {
      return res.status(404).send("Visa applications not found");
    }
    res.status(200).json(visaApplications);
  } catch (error) {
    res.status(500).send("Error retrieving visa applications");
  }
});

export default router;