import express from "express";
import {createMacAddress, getAllLockedAddresses} from "../controllers/macController";

const router = express.Router()

router.get('/get-all-locked', getAllLockedAddresses)

router.post('/create', createMacAddress)

export default router