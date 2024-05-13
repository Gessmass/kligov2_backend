import express from "express";
import {createOneDevice, getAllDevices, getDevicesFromUser} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)
router.get("/getAllFromUser/:userId", getDevicesFromUser)

router.post('/create', createOneDevice)

export default router
