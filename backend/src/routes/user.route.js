import express from "express";
import { getUserProfile } from "../controller/user.controller";

const router = express.Router();

router.get("/profile/:username", getUserProfile);

export default router;