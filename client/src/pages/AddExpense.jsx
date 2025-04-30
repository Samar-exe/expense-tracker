import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const AddExpense = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState('');

  const handleAddExpense = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/expenses',
        { description, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMsg('Expense added successfully!');
      setDescription('');
      setAmount('');
    } catch (err) {
      setMsg('Error adding expense.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={8}>
        <Typography variant="h5" gutterBottom>Add Expense</Typography>
        {msg && <Typography color="secondary">{msg}</Typography>}
        <form onSubmit={handleAddExpense}>
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
            Add Expense
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddExpense;
