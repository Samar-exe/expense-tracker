import React, { useState, useEffect } from 'react';
import ExpenseVisualization from '../components/ExpenseVisualization';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseItem from '../components/ExpenseItem';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view your expenses');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);

      // Calculate total expenses
      const total = res.data.reduce((sum, expense) => sum + expense.amount, 0);
      setTotalExpenses(total);
    } catch (err) {
      console.error(err);
      setError('Failed to load expenses. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
    setTotalExpenses((prev) => prev + Number(newExpense.amount));
    setShowForm(false);
  };

  const handleDeleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Find the deleted expense to update the total
      const deletedExpense = expenses.find(expense => expense._id === id);
      if (deletedExpense) {
        setTotalExpenses(prev => prev - deletedExpense.amount);
      }

      // Update the expenses list
      setExpenses(expenses.filter(expense => expense._id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
      setError('Failed to delete expense. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Expense Dashboard
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box mb={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowForm((prev) => !prev)}
            >
              {showForm ? 'Cancel' : 'Add Expense'}
            </Button>
          </Box>

          {showForm && (
            <Box mb={3}>
              <ExpenseForm onAdd={handleAddExpense} />
              <Divider sx={{ my: 2 }} />
            </Box>
          )}

          {/* Summary Box */}
          <Card sx={{ mb: 3, bgcolor: 'primary.dark' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Total Expenses</Typography>
                  <Typography variant="h4">${totalExpenses.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Expense Count</Typography>
                  <Typography variant="h4">{expenses.length}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Typography variant="h6" gutterBottom>Your Expenses:</Typography>

          {expenses.length === 0 ? (
            <Typography variant="body1">No expenses added yet.</Typography>
          ) : (
            expenses.map((expense) => (
              <ExpenseItem
                key={expense._id}
                expense={expense}
                onDelete={handleDeleteExpense}
              />
            ))
          )}
          {expenses.length > 0 && <ExpenseVisualization />}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;
