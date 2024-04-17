import * as express from "express";
import { getMessages, newMessage } from "../controllers/User";

const router = express.Router();

router.get("/messages", getMessages);
router.post("/new", newMessage);

export default router;
