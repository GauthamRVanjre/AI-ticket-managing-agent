import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { inngest } from "../inngest/index.js";

export const signUp = async (req, res) => {
  try {
    const { email, password, skills = [] } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      skills,
    });

    // Send user.signup event to Inngest
    await inngest.send({
      name: "user/signup",
      data: {
        email,
      },
    });

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { skills = [], role, email } = req.body;
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Not authorized" });
    }

    const user = User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const updatedUser = await User.updateOne(
      { email },
      { skills: skills.length ? skills : user.skills, role: role }
    );
    res.json(updatedUser);
  } catch (error) {}
};

export const getUsers = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Not authorized" });
    }
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
