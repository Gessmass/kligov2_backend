import express from "express";
import {createOneOrManyMacs} from "../controllers/macController";

const router = express.Router()

router.post('/create', createOneOrManyMacs)
export default router