import express from "express";

import interact from "./interact.js";

const router = express.Router();

router.post("/", interact);

export default router;