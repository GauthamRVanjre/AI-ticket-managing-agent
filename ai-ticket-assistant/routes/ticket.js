import express from "express";
import {
  assignTicket,
  createTicket,
  getKPIs,
  getTicket,
  getTickets,
  getTicketsForAdmin,
  updateTicket,
} from "../controllers/ticket.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", auth, getTickets);
router.get("/admin", auth, getTicketsForAdmin);
router.get("/kpis", auth, getKPIs);
router.get("/:id", auth, getTicket);
router.post("/", auth, createTicket);
router.patch("/:id", auth, updateTicket);
router.post("/assign", auth, assignTicket);

export default router;
