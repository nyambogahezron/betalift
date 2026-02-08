import { Router } from "express";
import { uploadFile } from "../controllers/uploadController";
import { authenticate as requireAuth } from "../middleware/authentication";
import { upload } from "../middleware/uploadMiddleware";

const router = Router();

router.post("/single", requireAuth, upload.single("file"), uploadFile);

export default router;
