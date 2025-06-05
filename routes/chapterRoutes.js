import express from "express";
import {
  uploadChapters,
  getChapters,
  getChaptersById,
} from "../controllers/chapterController.js";
import upload from "../middlewares/multer.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/chapters", getChapters);
router.get("/chapters/:id", getChaptersById);
router.post("/chapters", auth, upload.single("file"), uploadChapters);

export default router;
