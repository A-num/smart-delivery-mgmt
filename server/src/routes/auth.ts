import express from "express";
import {
  registerPartner,
  registerManager,
  loginPartner,
  loginManager,
  fetchPartner,
} from "../controllers/authController";

const router = express.Router();

router.post("/register-partner", registerPartner);
router.post("/register-manager", registerManager);
router.post("/login-partner", loginPartner);
router.post("/login-manager", loginManager);
router.get("/fetch-partner", fetchPartner);

export default router;
