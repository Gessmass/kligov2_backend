import express from "express";
import {storeDataAtFirstLaunch as storeDataOnFirstLaunch} from "../controllers/computerController";

const router = express.Router()

router.post("/at-first-launch", storeDataOnFirstLaunch)

export default router
