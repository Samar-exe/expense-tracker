import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { expenseService } from '../services/api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ExpenseVisualization = () => {
  const [tabValue, setTabValue] = useState(0);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categories, monthly] = await Promise.all([
          expenseService.getExpensesByCategory(),
          expenseService.getMonthlyExpenses()
        ]);

        setCategoryData(categories);
        setMonthlyData(monthly.map(item => ({
          name: `${item.year}-${item.month.toString().padStart(2, '0')}`,
          total: item.total
        })));
        setLoading(false);
      } catch (err) {
        setError('Failed to load visualization data');
        console.error('Error fetching visualization data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Card variant="outlined" sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expense Visualization
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
          <Tab label="By Category" />
          <Tab label="Monthly Trends" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Expense Distribution by Category
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="total"
                      nameKey="_id"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Category Breakdown
              </Typography>
              <Box>
                {categoryData.map((category, index) => (
                  <Box key={category._id} display="flex" alignItems="center" mb={1}>
                    <Box
                      width={16}
                      height={16}
                      bgcolor={COLORS[index % COLORS.length]}
                      mr={1}
                    />
                    <Typography variant="body2">
                      {category._id}: ${category.total.toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Monthly Expense Trends
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Total']} />
                  <Legend />
                  <Bar dataKey="total" fill="#8884d8" name="Monthly Total" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpenseVisualization;
