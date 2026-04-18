import api from './api';

const getDashboard = () => api.get('/manager/dashboard');
const getMenuItems = () => api.get('/manager/menu');
const createMenuItem = (itemData) => api.post('/manager/menu', itemData);
const updateMenuItem = (id, itemData) => api.put(`/manager/menu/${id}`, itemData);
const deleteMenuItem = (id) => api.delete(`/manager/menu/${id}`);
const getInventory = () => api.get('/manager/inventory'); // Assuming this route exists
const updateStock = (id, quantity) => api.put(`/manager/inventory/${id}`, { quantityToAdd: quantity });
const getSalesReport = (startDate, endDate) => api.post('/manager/reports/sales', { startDate, endDate });

export default {
    getDashboard,
    getMenuItems,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    getInventory,
    updateStock,
    getSalesReport,
};