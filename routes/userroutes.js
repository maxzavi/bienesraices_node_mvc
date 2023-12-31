import express from 'express';

import { formLogin, formRegister, authenticate ,register, confirm, formRecoveryPassword, resetPasswod, validateToken, newPassword, signOut}  from "../controller/userController.js"

const router = express.Router();

router.get("/login",formLogin);

router.post("/authenticate", authenticate)
router.post("/sign-out", signOut)

router.get("/register",formRegister);
router.post("/register",register);
router.get("/confirm/:token",confirm);

router.get("/recovery-password",formRecoveryPassword);
router.post("/recovery-password",resetPasswod);

router.get("/recovery-password/:token",validateToken);
router.post("/recovery-password/:token",newPassword);


export default router;