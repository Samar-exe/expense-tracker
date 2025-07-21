const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const authMiddleware = require("../middleswares/authMiddleware");
const mongoose = require("mongoose");

// Add expense
router.post("/", authMiddleware, async (req, res) => {
  const { title, amount, date, category } = req.body;

  if (!title || !amount || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newExpense = new Expense({
      title,
      amount,
      date,
      category: category || "Other",
      userId: req.user.userId,
    });

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

// Get expenses grouped by category
router.get("/by-category", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.userId) } }, // Fixed here
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching expenses by category:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching category data" });
  }
});

// Get monthly expenses breakdown
router.get("/monthly", authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.userId) } }, // Fixed here
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          total: 1,
          count: 1,
        },
      },
    ]);
    res.json(expenses);
  } catch (err) {
    console.error("Error fetching monthly expenses:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching monthly data" });
  }
});

// Delete expense
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

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
