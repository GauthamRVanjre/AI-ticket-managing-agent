import express from "express";
import {
  getUsers,
  login,
  logout,
  signUp,
  updateUser,
} from "../controllers/user.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

router.post("/updateUser", auth, updateUser);
router.get("/users", auth, getUsers);

router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
