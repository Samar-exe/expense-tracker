const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: String,
    amount: Number,
    date: Date,
    category: {
      type: String,
      enum: ['Food', 'Transportation', 'Housing', 'Entertainment', 'Utilities', 'Other'],
      default: 'Other'
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
