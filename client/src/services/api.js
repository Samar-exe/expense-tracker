import axios from "axios";
const API_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with base configuration
const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Request interceptor to add auth token
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Auth Services
export const authService = {
	register: async (email, password) => {
		const response = await api.post("/auth/register", { email, password });
		return response.data;
	},

	login: async (email, password) => {
		const response = await api.post("/auth/login", { email, password });
		localStorage.setItem("token", response.data.token);
		return response.data;
	},

	logout: () => {
		localStorage.removeItem("token");
	},

	getCurrentUser: async () => {
		const response = await api.get("/auth/user");
		return response.data;
	},

	isAuthenticated: () => {
		return !!localStorage.getItem("token");
	},
};

// Expense Services
export const expenseService = {
	getExpensesByCategory: async () => {
		const response = await api.get("/expenses/by-category");
		return response.data;
	},

	getMonthlyExpenses: async () => {
		const response = await api.get("/expenses/monthly");
		return response.data;
	},
	getExpenses: async () => {
		const response = await api.get("/expenses");
		return response.data;
	},

	addExpense: async (expenseData) => {
		const response = await api.post("/expenses", expenseData);
		return response.data;
	},

	deleteExpense: async (id) => {
		const response = await api.delete(`/expenses/${id}`);
		return response.data;
	},
};
export default { authService, expenseService };
