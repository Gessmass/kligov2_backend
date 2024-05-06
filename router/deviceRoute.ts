import express from "express";
import {getAllDevices, getDevicesFromUser} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)
router.get("/getAllFromUser/:userId", getDevicesFromUser)

export default router
