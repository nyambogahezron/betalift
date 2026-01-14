import { Router } from "express";
import { uploadFile } from "../controllers/uploadController";
import { upload } from "../middleware/uploadMiddleware";
import { authenticate as requireAuth } from "../middleware/authentication";

const router = Router();

router.post("/single", requireAuth, upload.single("file"), uploadFile);

export default router;
