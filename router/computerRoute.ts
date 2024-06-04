import express from "express";
import {createNewComputer, getComputerRole, updateComputerById} from "../controllers/computerController";

const router = express.Router()

router.get('/get-role/:computerId', getComputerRole)

router.put('/update-by-id', updateComputerById)

router.post("/create", createNewComputer)

export default router
