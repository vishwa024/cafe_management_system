import api from './api';

const getActiveOrders = () => api.get('/kitchen/orders');
const updateOrderStatus = (id, status) => api.put(`/kitchen/orders/${id}/status`, { status });
const toggleMenuItemAvailability = (id) => api.patch(`/kitchen/menu/${id}/availability`);
const logWaste = (wasteData) => api.post('/kitchen/waste', wasteData); // Assuming this route exists

export default {
    getActiveOrders,
    updateOrderStatus,
    toggleMenuItemAvailability,
    logWaste,
};