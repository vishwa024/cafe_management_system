import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import kitchenService from '../../services/kitchenService';

const WasteLoggingModal = ({ isOpen, onClose }) => {
    const [ingredients, setIngredients] = useState([]);
    const [formData, setFormData] = useState({ ingredientId: '', quantity: '', reason: 'Spoiled' });

    useEffect(() => {
        // You would need an endpoint to fetch all ingredients for the dropdown
        // const fetchIngredients = async () => { ... };
        // fetchIngredients();
        // Mock data for now:
        setIngredients([{ _id: '1', name: 'Milk' }, { _id: '2', name: 'Coffee Beans' }]);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await kitchenService.logWaste(formData);
            alert('Waste logged successfully!');
            onClose();
        } catch (error) {
            console.error("Failed to log waste:", error);
            alert("Error logging waste.");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4">Log Waste</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Ingredient</label>
                    <select value={formData.ingredientId} onChange={(e) => setFormData({...formData, ingredientId: e.target.value})} className="w-full p-2 border rounded" required>
                        <option value="">Select an ingredient</option>
                        {ingredients.map(ing => (
                            <option key={ing._id} value={ing._id}>{ing.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                    <input type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                    <select value={formData.reason} onChange={(e) => setFormData({...formData, reason: e.target.value})} className="w-full p-2 border rounded">
                        <option value="Spoiled">Spoiled</option>
                        <option value="Mistake">Mistake</option>
                        <option value="Expired">Expired</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">Log Waste</button>
                </div>
            </form>
        </Modal>
    );
};

export default WasteLoggingModal;