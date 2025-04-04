// // import React, { useState } from "react";
// // import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// // import styles from "../../styles/styles";
// // import { Link } from "react-router-dom";
// // import { RxAvatar } from "react-icons/rx";
// // import axios from "axios";
// // import { toast } from "react-toastify"; // ✅ Import correct
// // import "react-toastify/dist/ReactToastify.css"; // ✅ Import des styles (déjà présent dans App.js mais ça ne gêne pas)

// // const Signup = () => {
// //   const [email, setEmail] = useState("");
// //   const [name, setName] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [visible, setVisible] = useState(false);
// //   const [avatar, setAvatar] = useState(null);
// //   const [preview, setPreview] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   const handleFileInputChange = (e) => {
// //     const file = e.target.files[0];

// //     if (!file) {
// //       console.log("Aucun fichier sélectionné !");
// //       return;
// //     }

// //     setAvatar(file);
// //     setPreview(URL.createObjectURL(file));
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();

// //     if (loading) {
// //       toast.warn("⚠ Une inscription est déjà en cours !");
// //       return;
// //     }

// //     setLoading(true);

// //     const formData = new FormData();
// //     formData.append("name", name);
// //     formData.append("email", email);
// //     formData.append("password", password);
// //     if (avatar) formData.append("avatar", avatar);

// //     try {
// //       const res = await axios.post("http://localhost:8000/api/v2/user/create-user", formData, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });

// //       toast.success("✅ Inscription réussie !");
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "❌ Erreur inconnue. Veuillez réessayer.");
// //     }

// //     setLoading(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
// //       <div className="sm:mx-auto sm:w-full sm:max-w-md">
// //         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// //           Register as a new user
// //         </h2>
// //       </div>
// //       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
// //         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
// //           <form className="space-y-6" onSubmit={handleSubmit}>
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Full Name</label>
// //               <div className="mt-1">
// //                 <input
// //                   type="text"
// //                   required
// //                   value={name}
// //                   onChange={(e) => setName(e.target.value)}
// //                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                 />
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Email address</label>
// //               <div className="mt-1">
// //                 <input
// //                   type="email"
// //                   required
// //                   value={email}
// //                   onChange={(e) => setEmail(e.target.value)}
// //                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                 />
// //               </div>
// //             </div>

// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Password</label>
// //               <div className="mt-1 relative">
// //                 <input
// //                   type={visible ? "text" : "password"}
// //                   required
// //                   value={password}
// //                   onChange={(e) => setPassword(e.target.value)}
// //                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                 />
// //                 {visible ? (
// //                   <AiOutlineEye className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(false)} />
// //                 ) : (
// //                   <AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(true)} />
// //                 )}
// //               </div>
// //             </div>

// //             <div>
// //               <div className="mt-2 flex items-center">
// //                 <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
// //                   {preview ? (
// //                     <img src={preview} alt="avatar" className="h-full w-full object-cover rounded-full" />
// //                   ) : (
// //                     <RxAvatar className="h-8 w-8" />
// //                   )}
// //                 </span>
// //                 <label
// //                   htmlFor="file-input"
// //                   className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
// //                 >
// //                   <span>Upload a file</span>
// //                   <input
// //                     type="file"
// //                     id="file-input"
// //                     accept=".jpg,.jpeg,.png"
// //                     onChange={handleFileInputChange}
// //                     className="sr-only"
// //                   />
// //                 </label>
// //               </div>
// //             </div>

// //             <div>
// //               <button
// //                 type="submit"
// //                 className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
// //                 disabled={loading}
// //               >
// //                 {loading ? "Inscription en cours..." : "S'inscrire"}
// //               </button>
// //             </div>
// //             <div className={`${styles.noramlFlex} w-full`}>
// //               <h4>Already have an account?</h4>
// //               <Link to="/login" className="text-blue-600 pl-2">Sign In</Link>
// //             </div>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Signup;
// import React, { useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import styles from "../../styles/styles";
// import { Link } from "react-router-dom";
// import { RxAvatar } from "react-icons/rx";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Signup = () => {
//   const [email, setEmail] = useState("");
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [avatar, setAvatar] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFileInputChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     setAvatar(file);
//     setPreview(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (loading) {
//       toast.warn("⚠ Une inscription est déjà en cours !");
//       return;
//     }
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("password", password);
//     if (avatar) formData.append("avatar", avatar);

//     try {
//       await axios.post("http://localhost:8000/api/v2/user/create-user", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       toast.success("✅ Inscription réussie !");
//     } catch (error) {
//       toast.error(error.response?.data?.message || "❌ Erreur inconnue. Veuillez réessayer.");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 relative px-4">
//       {/* Arrière-plan */}
//       <div className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/50"
//            style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
//       </div>
      
//       {/* Conteneur principal */}
//       <div className="relative z-10 flex flex-col md:flex-row w-full md:w-[800px] h-auto md:h-[75vh] bg-white shadow-lg rounded-lg overflow-hidden">

//         {/* Partie gauche : Image avec texte */}
//         {/* Côté gauche : Image + Texte */}
// <div className="hidden md:flex md:w-1/2 bg-cover bg-center relative"
//      style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
//   <div className="absolute inset-0 bg-black/50 flex items-center justify-center px-6">
//     <h2 className="text-[#F5F3EE] text-3xl font-bold text-center leading-snug drop-shadow-lg">
//     Achetez, vendez<br />
//       <span className="text-[#E0D6CC] font-semibold">renouvelez votre dressing</span>
//     </h2>
//   </div>
// </div>


//         {/* Partie droite : Formulaire */}
//         <div className="w-full md:w-1/2 flex flex-col justify-center p-8 md:p-10">
//           <h2 className="text-lg font-medium text-[#6D4C41] text-center mb-6 leading-relaxed">
//             Rejoignez-nous dès maintenant !
//           </h2>

//           <form className="space-y-5" onSubmit={handleSubmit}>
//             {/* Avatar */}
//             <div className="flex flex-col items-center">
//   <label htmlFor="file-input" className="cursor-pointer relative">
//     <div className="h-20 w-20 rounded-full border-2 border-[#8B5E3C] flex items-center justify-center overflow-hidden hover:opacity-80 transition">
//       {preview ? (
//         <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
//       ) : (
//         <div className="flex flex-col items-center">
//           <RxAvatar className="h-10 w-10 text-[#8B5E3C]" />
//           <span className="text-xs text-[#8B5E3C]">Ajouter une photo</span>
//         </div>
//       )}
//     </div>
//     <input
//       type="file"
//       id="file-input"
//       accept=".jpg,.jpeg,.png"
//       onChange={handleFileInputChange}
//       className="sr-only"
//     />
//   </label>
//   {avatar && <p className="block text-sm font-medium text-gray-700"> Image ajoutée avec succès</p>}
// </div>



//             {/* Champs */}
//             <div>
//   <label className="block text-sm font-medium text-gray-700">Nom complet</label>
//   <input
//     type="text"
//     required
//     value={name}
//     onChange={(e) => setName(e.target.value)}
//     placeholder="Ex: Nom Prénom"
//     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8B5E3C] focus:border-[#8B5E3C] placeholder-gray-500 sm:text-sm"
//   />
// </div>

// <div>
//   <label className="block text-sm font-medium text-gray-700">Email</label>
//   <input
//     type="email"
//     required
//     value={email}
//     onChange={(e) => setEmail(e.target.value)}
//     placeholder="Ex: exemple@email.com"
//     className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8B5E3C] focus:border-[#8B5E3C] placeholder-gray-500 sm:text-sm"
//   />
// </div>

// <div>
//   <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
//   <div className="relative">
//     <input
//       type={visible ? "text" : "password"}
//       required
//       minLength={4} // ✅ Mot de passe minimum 4 caractères
//       value={password}
//       onChange={(e) => setPassword(e.target.value)}
//       placeholder="Minimum 4 caractères"
//       className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#8B5E3C] focus:border-[#8B5E3C] placeholder-gray-500 sm:text-sm"
//     />
//     {visible ? (
//       <AiOutlineEye className="absolute right-3 top-3 cursor-pointer text-[#8B5E3C]" size={20} onClick={() => setVisible(false)} />
//     ) : (
//       <AiOutlineEyeInvisible className="absolute right-3 top-3 cursor-pointer text-[#8B5E3C]" size={20} onClick={() => setVisible(true)} />
//     )}
//   </div>
//   {/* ✅ Message d'erreur si le mot de passe est trop court */}
//   {password.length > 0 && password.length < 4 && (
//     <p className="text-red-500 text-sm mt-1">Le mot de passe doit contenir au moins 4 caractères.</p>
//   )}
// </div>


//             <button type="submit" className="w-full py-3 bg-[#8B5E3C] text-white font-semibold rounded-md hover:bg-[#6D4C41] transition">
//               {loading ? "Inscription en cours..." : "S'inscrire"}
//             </button>
//           </form>

//           <p className="text-center text-gray-700 mt-4 text-sm">
//   Déjà inscrit ?
//   <Link to="/login" className="text-[#8B5E3C] font-semibold hover:underline transition duration-200">
//     Se connecter
//   </Link>
// </p>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineUser, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Vérifier la taille du fichier (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("L'image doit être inférieure à 2MB");
      return;
    }
    
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (loading) {
      toast.warn("⚠ Une inscription est déjà en cours !");
      return;
    }

    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v2/user/create-user", 
        formData, 
        { headers: { "Content-Type": "multipart/form-data" }}
      );
      
      toast.success("✅ Inscription réussie !");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "❌ Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0] px-4 py-10">
      {/* Conteneur principal */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white border border-[#EDDFCF]">
        
        {/* Partie gauche : Image et branding */}
        <div className="w-full md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
          </div>
          
          {/* Overlay avec texte */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#5C4033]/70 to-[#8B5E3C]/70 flex flex-col justify-center items-center p-8 text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 w-4/5 border border-white/30">
              <h1 className="text-2xl font-bold text-white mb-3">REWEAR</h1>
              <p className="text-white text-lg mb-2">Seconde main, premier choix</p>
              <p className="text-white/80 text-sm">Vendez, achetez et renouvelez votre garde-robe de façon éco-responsable</p>
            </div>
          </div>
        </div>
        
        {/* Partie droite : Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-[#5C4033] mb-2">Créer un compte</h2>
            <p className="text-[#8B5E3C]">Rejoignez la communauté Rewear</p>
          </div>
          
          {/* Avatar upload */}
          <div className="flex justify-center mb-6">
            <label htmlFor="avatar-upload" className="cursor-pointer group">
              <div className="h-24 w-24 rounded-full border-2 border-[#D2691E] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#A0522D]">
                {preview ? (
                  <img src={preview} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full w-full bg-[#FFF9F0] transition-all group-hover:bg-[#FFE4C4]">
                    <RxAvatar className="h-10 w-10 text-[#D2691E]" />
                    <span className="text-xs text-[#8B5E3C] mt-1 text-center px-1">Ajouter une photo</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept=".jpg,.jpeg,.png"
                onChange={handleFileInputChange}
                className="sr-only"
              />
            </label>
          </div>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Nom complet */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1">Nom complet</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUser className="text-[#8B5E3C]" size={20} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Entrez votre nom complet"
                  className="w-full pl-10 pr-3 py-3 border border-[#EDDFCF] rounded-lg bg-[#FFF9F0] focus:ring-[#D2691E] focus:border-[#D2691E] focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1">Adresse e-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineMail className="text-[#8B5E3C]" size={20} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entrez votre email"
                  className="w-full pl-10 pr-3 py-3 border border-[#EDDFCF] rounded-lg bg-[#FFF9F0] focus:ring-[#D2691E] focus:border-[#D2691E] focus:outline-none transition-colors"
                />
              </div>
            </div>
            
            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-[#5C4033] mb-1">Mot de passe</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="text-[#8B5E3C]" size={20} />
                </div>
                <input
                  type={visible ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-10 pr-12 py-3 border border-[#EDDFCF] rounded-lg bg-[#FFF9F0] focus:ring-[#D2691E] focus:border-[#D2691E] focus:outline-none transition-colors"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {visible ? (
                    <AiOutlineEye 
                      className="cursor-pointer text-[#8B5E3C] hover:text-[#D2691E]" 
                      size={20} 
                      onClick={() => setVisible(false)} 
                    />
                  ) : (
                    <AiOutlineEyeInvisible 
                      className="cursor-pointer text-[#8B5E3C] hover:text-[#D2691E]" 
                      size={20} 
                      onClick={() => setVisible(true)} 
                    />
                  )}
                </div>
              </div>
              {password && password.length < 6 && (
                <p className="mt-1 text-sm text-red-500">Le mot de passe doit contenir au moins 6 caractères</p>
              )}
            </div>
            
            {/* Conditions d'utilisation */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-[#D2691E] rounded border-[#EDDFCF] focus:ring-[#D2691E]"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="terms" className="text-[#5C4033]">
                  J'accepte les <a href="/terms" className="text-[#D2691E] hover:underline">conditions d'utilisation</a> et la <a href="/privacy" className="text-[#D2691E] hover:underline">politique de confidentialité</a>
                </label>
              </div>
            </div>
            
            {/* Bouton d'inscription */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 flex justify-center items-center bg-[#D2691E] text-white font-semibold rounded-lg hover:bg-[#A0522D] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2691E]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Inscription en cours...
                </>
              ) : (
                "Créer mon compte"
              )}
            </button>
          </form>
          
          {/* Lien vers connexion */}
          <div className="text-center mt-6">
            <p className="text-[#5C4033]">
              Déjà membre ? 
              <Link to="/login" className="ml-1 font-medium text-[#D2691E] hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

