import express from "express";
import * as actionController from "../controllers/action.controller.js";

const router = express.Router();

router.get("", actionController.getActionsByDevice);

export default router;
