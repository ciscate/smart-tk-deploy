// ConfirmModal.jsx
import React from 'react';

export function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
                <h2 className="text-2xl font-semibold mb-4">Confirmar</h2>
                <p className="text-gray-700 mb-6">{message || "Are you sure you want to proceed?"}</p>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Si
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
}
