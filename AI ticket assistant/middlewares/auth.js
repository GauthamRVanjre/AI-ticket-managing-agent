import jwt from "jsonwebtoken";

export const auth = async (req, res, next) => {
  try {
    console.log("auth hit");
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
