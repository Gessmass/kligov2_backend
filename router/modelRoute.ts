import express from "express";
import {createOneModel, getCreateModelFormData} from "../controllers/modelController";

const router = express.Router()

router.get('/create-form-options', getCreateModelFormData)

router.post('/create', createOneModel)
export default router