import React from "react";

function PopupModal({ show, message, onClose, isError }) {
    if (!show) {
        return null;
    }

    return (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <h2 className={`text-lg ${isError ? 'text-red-500' : 'text-green-500'}`}>{message}</h2>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition ease-in-out duration-150">Close</button>
            </div>
        </div>
    );
}

export default PopupModal;