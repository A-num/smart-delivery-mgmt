import express from 'express'
import { registerPartner, registerManager, loginPartner, loginManager } from '../controllers/authController';

const router = express.Router();

router.post('/register-partner', registerPartner);
router.post('/register-manager', registerManager);
router.post('/login-partner', loginPartner);
router.post('/login-manager', loginManager);

export default router;
