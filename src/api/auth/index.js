import express from "express";

import login from "./login.js";
import signup from "./signup/index.js";
import verify from "./signup/verify.js";
import saveinfo from "./signup/saveinfo.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/signup/verify", verify);
router.post("/signup/saveinfo", saveinfo);

export default router;