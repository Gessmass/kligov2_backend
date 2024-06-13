import express from "express";
import {getComputerRole} from "../controllers/computerController";

const router = express.Router()

router.get('/get-role/:computerId', getComputerRole)

export default router
