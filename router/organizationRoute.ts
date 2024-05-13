import express from "express";
import {getAllOrganizations} from "../controllers/organizationController";

const router = express.Router()

router.use('/', getAllOrganizations)

export default router