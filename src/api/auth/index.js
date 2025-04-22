import express from "express";

import { login } from "./login.js";
// import { register } from "./register.js";

const router = express.Router();

// router.post('/register', register);
router.post("/login", login);

export default router;