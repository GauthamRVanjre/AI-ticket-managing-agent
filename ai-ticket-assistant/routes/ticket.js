import express from "express";
import {
  getTicket,
  getTickets,
  createTicket,
  updateTicket,
} from "../controllers/ticket.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getTickets);
router.get("/:id", auth, getTicket);
router.post("/", auth, createTicket);
router.patch("/:id", auth, updateTicket);

export default router;
