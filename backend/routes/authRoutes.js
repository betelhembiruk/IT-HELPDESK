import express from "express";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "arada" && password === "Welcome2arada") {
    return res.json({
      success: true,
      user: { username: "arada" }
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid credentials"
  });
});

export default router;