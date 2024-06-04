import express from "express";
import {login, logout} from "../controllers/authController";

const router = express.Router()

router.post('/login', login)
router.get('/logout', logout) // TODO changer GET à POST

export default router
