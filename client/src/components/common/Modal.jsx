import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <button onClick={onClose} className="float-right text-gray-500 hover:text-gray-800 text-2xl leading-none">&times;</button>
                <div className="clear-both">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;