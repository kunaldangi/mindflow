import express from "express";

import create from "./create.js";

const router = express.Router();

router.post("/create", create);

export default router;