import React from 'react';
import Modal from '../common/Modal';

const RecipeModal = ({ isOpen, onClose, item }) => {
    if (!item) return null;

    // This would be fetched from an API endpoint like /api/menu/:id/recipe
    const mockRecipe = {
        name: item?.name || 'Item Name',
        ingredients: ['Espresso Shot', 'Steamed Milk', 'Milk Foam'],
        steps: ['1. Pull a perfect espresso shot.', '2. Steam milk to 65°C, creating a fine microfoam.', '3. Pour the steamed milk over the espresso.', '4. Top with a dollop of foam.'],
        imageUrl: 'https://via.placeholder.com/300x200'
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2 className="text-2xl font-bold mb-4">Recipe: {mockRecipe.name}</h2>
            <img src={mockRecipe.imageUrl} alt={mockRecipe.name} className="w-full h-48 object-cover rounded mb-4"/>
            <div className="mb-4">
                <h3 className="font-semibold text-lg">Ingredients:</h3>
                <ul className="list-disc list-inside">
                    {mockRecipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                </ul>
            </div>
            <div>
                <h3 className="font-semibold text-lg">Preparation Steps:</h3>
                <ol className="list-decimal list-inside">
                    {mockRecipe.steps.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
            </div>
        </Modal>
    );
};

export default RecipeModal;