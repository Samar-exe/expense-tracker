import React from 'react';
import { Card, CardContent, Typography, Box, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const ExpenseItem = ({ expense, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      onDelete(expense._id);
    }
  };

  return (
    <Box mb={2}>
      <Card variant="outlined">
        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="subtitle1">{expense.title}</Typography>
            <Typography color="text.secondary">
              ${expense.amount.toFixed(2)} — {new Date(expense.date).toLocaleDateString()}
            </Typography>
          </Box>
          <IconButton onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ExpenseItem;
