import express from "express";
import {activateDevice, createOneDevice, getAllDevices} from "../controllers/deviceController";

const router = express.Router()

router.get("/", getAllDevices)

router.post('/create', createOneDevice)
router.post('/activate', activateDevice)

export default router
