// import React from "react";

// const LogoutConfirmPopup = ({ isOpen, onClose, onConfirm }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 animate-fade-in">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmation</h2>
//         <p className="text-gray-600 mb-6">
//           Êtes-vous sûr de vouloir vous déconnecter ?
//         </p>
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
//           >
//             Annuler
//           </button>
//           <button
//             onClick={onConfirm}
//             className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
//           >
//             Oui, me déconnecter
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LogoutConfirmPopup;
import React from "react";

const LogoutConfirmPopup = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-0 max-w-md w-full mx-auto overflow-hidden transform transition-all animate-fade-in border border-amber-100">
        {/* En-tête avec dégradé ambre */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-700 p-4 text-white">
          <h2 className="text-xl font-semibold flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Confirmation de déconnexion
          </h2>
        </div>
        
        {/* Corps du popup */}
        <div className="p-6 bg-amber-50">
          <div className="flex items-start mb-4">
            <div className="bg-amber-100 p-3 rounded-full mr-4 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <p className="text-gray-700">
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à nouveau à votre compte.
            </p>
          </div>
        </div>
        
        {/* Boutons d'action */}
        <div className="border-t border-amber-100 p-4 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmPopup;