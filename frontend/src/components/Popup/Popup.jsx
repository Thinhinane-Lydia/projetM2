import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Popup = ({ message, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Fermeture automatique après 3 secondes
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="text-gray-800 text-lg">{message}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition"
          >
            Se connecter
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
