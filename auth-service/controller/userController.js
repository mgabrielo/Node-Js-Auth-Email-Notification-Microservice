const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { producer } = require("../config/kafka");
const { redisClient } = require("../config/redis");
const { pool } = require("../config/pg-db");

// Register user
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, hashedPassword]
    );
    await producer.connect(); // Optional: only once if not already connected
    await producer.send({
      topic: "user-registered",
      messages: [
        {
          value: JSON.stringify(result.rows[0]),
        },
      ],
    });
    res.json({ message: "Sign Up Success", user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, "secretkey", {
      expiresIn: "1h",
    });
    await redisClient.connect();
    await redisClient.set(`token:${token}`, user.id);
    res.json({ message: "Sign In Sucess", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in user" });
  }
});

// Logout user
router.post("/logout", async (req, res) => {
  const token = req.headers.authorization;

  try {
    await redisClient.connect();
    await redisClient.del(`token:${token}`);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging out user" });
  }
});

module.exports = router;
