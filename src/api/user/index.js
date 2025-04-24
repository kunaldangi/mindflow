import express from "express";

const router = express.Router();

import info from "./info.js";

router.get("/info", info);

export default router;