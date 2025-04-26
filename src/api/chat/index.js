import express from "express";

import createChat from "./post.js";
import getChats from "./get.js";
import deleteChat from "./delete.js";
import getMessages from "./messages/get.js";

const router = express.Router();

router.post("/", createChat);
router.get("/", getChats);
router.delete("/", deleteChat);
router.get("/messages", getMessages);

export default router;