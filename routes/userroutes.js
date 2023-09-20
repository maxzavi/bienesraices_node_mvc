import express from 'express';

import { formLogin, formRegister, register, formRecoveryPassword}  from "../controller/userController.js"

const router = express.Router();

router.get("/login",formLogin);
router.get("/register",formRegister);
router.post("/register",register);

router.get("/recovery-password",formRecoveryPassword);


export default router;