import express from "express";
import {createNewComputer, getComputerRole} from "../controllers/computerController";

const router = express.Router()

router.get('/get-role/:computerId', getComputerRole)

router.post("/create", createNewComputer)

export default router
