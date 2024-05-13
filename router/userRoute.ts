import express from "express";
import {createOneUser} from "../controllers/userController";

const router = express.Router()

router.post('/create', createOneUser)

export default router
