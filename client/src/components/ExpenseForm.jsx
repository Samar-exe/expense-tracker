import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Grid,
  InputAdornment,
  MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { expenseService } from '../services/api';

const ExpenseForm = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState('Other');
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!title.trim()) {
      setError('Please enter a title for the expense');
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    setLoading(true);

    try {
      const newExpense = await expenseService.addExpense({
        title: title.trim(),
        amount: Number(amount),
        date,
        category
      });

      onAdd(newExpense);

      // Reset form
      setTitle('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error('Add expense error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Expense Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="e.g., Groceries, Rent, etc."
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
            required
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
            placeholder="0.00"
          />
        </Grid>
      </Grid>

      <TextField
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        required
      />

      <Grid item xs={12} md={6}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Transportation">Transportation</MenuItem>
            <MenuItem value="Housing">Housing</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
            <MenuItem value="Utilities">Utilities</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : 'Add Expense'}
      </Button>
    </Box>
  );
};

export default ExpenseForm;
