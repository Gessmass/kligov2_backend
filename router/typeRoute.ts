import express from "express";
import {getAllModelsTypes} from "../controllers/typeController";

const router = express.Router()

router.use('/', getAllModelsTypes)

export default router