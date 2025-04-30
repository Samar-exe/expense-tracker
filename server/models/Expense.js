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
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
