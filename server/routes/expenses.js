const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleswares/authMiddleware");

// Add expense
router.post("/", authMiddleware, async (req, res) => {
  console.log("Decoded user from token:", req.user);
  const { title, amount, date } = req.body;
  console.log("got the body");
  if (!title || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newExpense = new Expense({
      title,
      amount,
      date,
      userId: req.user.userId, // Changed from req.user.id to req.user.userId
    });
    console.log("new object is being created but failing to save");
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    console.error("Error saving expense:", err);
    res.status(500).json({ message: "Server error while saving expense" });
  }
});

// Get all expenses for the user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.userId });
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Server error while fetching expenses" });
  }
});

// Delete expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Check if the expense belongs to the authenticated user
    if (expense.userId.toString() !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this expense" });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Server error while deleting expense" });
  }
});

module.exports = router;
