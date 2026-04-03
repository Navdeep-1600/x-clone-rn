import express from "express";
import { getUserProfile } from "../controller/user.controller.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);

export default router;