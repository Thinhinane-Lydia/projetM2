
// import { React, useState } from "react";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { server } from "../../server.js";
// import { toast } from "react-toastify";
// import { AiOutlineCheckCircle, AiOutlineUser, AiOutlineLock } from "react-icons/ai";

// const Login = () =>{
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [visible, setVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/api/v2/user/login-user",
//         { email, password },
//         { withCredentials: true }
//       );

//       if (response.data.token) {
//         localStorage.setItem("token", response.data.token);
        
//         if (response.data.user && response.data.user._id) {
//           localStorage.setItem("userId", response.data.user._id);
          
//           // Stocker le rôle de l'utilisateur
//           if (response.data.user.role) {
//             localStorage.setItem("userRole", response.data.user.role);
//           }
          
//           console.log("✅ userId stocké dans localStorage :", response.data.user._id);
//         } else {
//           console.error("❌ Aucun userId reçu !");
//         }
      
//         axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        
//         toast.success("Connexion réussie !");
        
//         // Rediriger selon le rôle
//         if (response.data.user && response.data.user.role === "admin") {
//           setTimeout(() => navigate("/Admin"), 1000);
//         } else {
//           setTimeout(() => navigate("/"), 1000);
//         }
//       } else {
//         console.error("Aucun token reçu !");
//         toast.error("Erreur de connexion: Aucun token reçu");
//       }
//     } catch (err) {
//       console.error("Erreur de connexion :", err.response?.data?.message || err);
//       toast.error(err.response?.data?.message || "Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0] px-4 py-10">
//       {/* Conteneur principal avec effet d'ombre et bordure */}
//       <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white border border-[#EDDFCF]">
        
//         {/* Partie gauche : Image et branding */}
//         <div className="w-full md:w-1/2 relative overflow-hidden">
//           <div className="absolute inset-0 bg-cover bg-center"
//                style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
//           </div>
          
//           {/* Overlay avec le logo et slogan */}
//           <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033]/80 to-transparent flex flex-col justify-end p-8">
//             <div className="bg-white/90 rounded-lg p-6 backdrop-blur-sm">
//               <h1 className="text-2xl font-bold text-[#5C4033] mb-2">REWEAR</h1>
//               <p className="text-[#8B5E3C]">Seconde main, premier choix</p>
//             </div>
//           </div>
//         </div>
        
//         {/* Partie droite : Formulaire */}
//         <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
//           <div className="text-center mb-8">
//             <h2 className="text-2xl font-bold text-[#5C4033] mb-2">Connexion</h2>
//             <p className="text-[#8B5E3C]">Accédez à votre espace Rewear</p>
//           </div>
          
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             {/* Email input */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium text-[#5C4033] mb-1">Adresse e-mail</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <AiOutlineUser className="text-[#8B5E3C]" size={20} />
//                 </div>
//                 <input
//                   type="email"
//                   required
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="Entrez votre email"
//                   className="w-full pl-10 pr-3 py-3 border border-[#EDDFCF] rounded-lg bg-[#FFF9F0] focus:ring-[#D2691E] focus:border-[#D2691E] focus:outline-none transition-colors"
//                 />
//               </div>
//             </div>
            
//             {/* Password input */}
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <label className="block text-sm font-medium text-[#5C4033] mb-1">Mot de passe</label>
//                 <Link to="/forgot-password" className="text-sm text-[#D2691E] hover:underline">
//                   Mot de passe oublié?
//                 </Link>
//               </div>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <AiOutlineLock className="text-[#8B5E3C]" size={20} />
//                 </div>
//                 <input
//                   type={visible ? "text" : "password"}
//                   required
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="Entrez votre mot de passe"
//                   className="w-full pl-10 pr-12 py-3 border border-[#EDDFCF] rounded-lg bg-[#FFF9F0] focus:ring-[#D2691E] focus:border-[#D2691E] focus:outline-none transition-colors"
//                 />
//                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
//                   {visible ? (
//                     <AiOutlineEye 
//                       className="cursor-pointer text-[#8B5E3C] hover:text-[#D2691E]" 
//                       size={20} 
//                       onClick={() => setVisible(false)} 
//                     />
//                   ) : (
//                     <AiOutlineEyeInvisible 
//                       className="cursor-pointer text-[#8B5E3C] hover:text-[#D2691E]" 
//                       size={20} 
//                       onClick={() => setVisible(true)} 
//                     />
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Remember me checkbox */}
//             <div className="flex items-center">
//               <input
//                 type="checkbox"
//                 id="remember"
//                 className="h-4 w-4 text-[#D2691E] rounded border-[#EDDFCF] focus:ring-[#D2691E]"
//               />
//               <label htmlFor="remember" className="ml-2 block text-sm text-[#5C4033]">
//                 Se souvenir de moi
//               </label>
//             </div>
            
//             {/* Login button */}
//             <button 
//               type="submit" 
//               disabled={loading}
//               className="w-full py-3 px-4 flex justify-center items-center bg-[#D2691E] text-white font-semibold rounded-lg hover:bg-[#A0522D] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2691E]"
//             >
//               {loading ? (
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//               ) : (
//                 "Se connecter"
//               )}
//             </button>
//           </form>
          
//           {/* Separator */}
//           <div className="my-6 flex items-center">
//             <div className="flex-grow border-t border-[#EDDFCF]"></div>
//             <span className="mx-4 text-sm text-[#8B5E3C]">OU</span>
//             <div className="flex-grow border-t border-[#EDDFCF]"></div>
//           </div>
          
//           {/* Sign up link */}
//           <div className="text-center">
//             <p className="text-[#5C4033]">
//               Pas encore de compte ? 
//               <Link to="/sign-up" className="ml-1 font-medium text-[#D2691E] hover:underline">
//                 S'inscrire
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { React, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v2/user/login-user",
        { email, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        
        if (response.data.user && response.data.user._id) {
          localStorage.setItem("userId", response.data.user._id);
          
          // Stocker le rôle de l'utilisateur
          if (response.data.user.role) {
            localStorage.setItem("userRole", response.data.user.role);
          }
          
          console.log("✅ userId stocké dans localStorage :", response.data.user._id);
        } else {
          console.error("❌ Aucun userId reçu !");
        }
      
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
        
        toast.success("Connexion réussie !");
        
        // Rediriger selon le rôle
        if (response.data.user && response.data.user.role === "admin") {
          setTimeout(() => navigate("/Admin"), 1000);
        } else {
          setTimeout(() => navigate("/"), 1000);
        }
      } else {
        console.error("Aucun token reçu !");
        toast.error("Erreur de connexion: Aucun token reçu");
      }
    } catch (err) {
      console.error("Erreur de connexion :", err.response?.data?.message || err);
      toast.error(err.response?.data?.message || "Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Éléments décoratifs en arrière-plan */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/30 blur-3xl"></div>
        <div className="absolute top-1/2 -right-48 w-96 h-96 rounded-full bg-amber-300/30 blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 rounded-full bg-amber-100/40 blur-3xl"></div>
        
        {/* Motifs de vêtements stylisés en arrière-plan */}
        <div className="absolute top-20 right-20 w-16 h-16 border-2 border-amber-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-32 left-20 w-24 h-8 border-2 border-amber-300 opacity-20"></div>
        <div className="absolute top-1/3 left-1/4 w-8 h-32 border-2 border-amber-400 opacity-10"></div>
      </div>
      
      {/* Conteneur principal */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-3xl shadow-2xl bg-white/90 backdrop-blur-lg border border-amber-100 z-10 overflow-hidden relative">
        
        {/* Partie gauche - Image avec effet parallaxe */}
        <div className="w-full md:w-1/2 relative overflow-hidden h-60 md:h-auto">
          <div className="absolute inset-0 bg-cover bg-center transform hover:scale-110 transition-transform duration-700 ease-in-out"
               style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
          </div>
          
          {/* Overlay effet vintage */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-700/70 to-amber-500/30"></div>
          
          {/* Badge flottant */}
          <div className="absolute top-10 left-10 bg-white/90 backdrop-blur-sm rounded-full px-5 py-2 shadow-lg transform -rotate-12">
            <span className="text-amber-800 font-bold">SECONDE VIE</span>
          </div>
          
          {/* Zone de branding */}
          <div className="absolute bottom-0 left-0 right-0 p-8 backdrop-blur-sm">
            <div className="relative rounded-xl p-6 overflow-hidden">
              <div className="absolute inset-0 bg-amber-50/70 backdrop-blur-sm"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-extrabold text-amber-900 mb-2 tracking-tighter">REWEAR</h1>
                <p className="text-amber-700 font-medium italic text-lg">Seconde main, premier style</p>
                <div className="mt-3 flex space-x-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg key={star} xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Décoration de vêtements stylisée */}
          <div className="absolute top-1/3 right-12">
            <svg className="w-20 h-20 text-white/30" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21 4.27l-1.47-1.27-0.89-0.77c-0.34-0.29-0.77-0.47-1.24-0.49-0.03-0.01-0.06-0.01-0.09-0.01h-3.31c0 0.83-0.67 1.5-1.5 1.5s-1.5-0.67-1.5-1.5h-3.31c-0.03 0-0.06 0-0.09 0.01-0.47 0.02-0.9 0.2-1.24 0.49l-0.89 0.77-1.47 1.27c-0.58 0.5-0.58 1.41 0 1.91l1.47 1.27 0.89 0.77v12.05c0 0.83 0.67 1.5 1.5 1.5h9.17c0.83 0 1.5-0.67 1.5-1.5v-12.05l0.89-0.77 1.47-1.27c0.58-0.5 0.58-1.41 0-1.91zM12 3c0.55 0 1 0.45 1 1s-0.45 1-1 1-1-0.45-1-1 0.45-1 1-1zm8 2.3l-1.47 1.27-0.89 0.77v12.95c0 0.28-0.22 0.5-0.5 0.5h-9.17c-0.28 0-0.5-0.22-0.5-0.5v-12.95l-0.89-0.77-1.47-1.27c-0.19-0.17-0.19-0.47 0-0.64l1.47-1.27 0.89-0.77c0.12-0.1 0.26-0.16 0.42-0.16h4.14c0.16 0.59 0.62 1.05 1.21 1.21 0.2 0.05 0.4 0.08 0.61 0.08 0.21 0 0.41-0.03 0.61-0.08 0.59-0.16 1.05-0.62 1.21-1.21h4.14c0.16 0 0.3 0.06 0.42 0.16l0.89 0.77 1.47 1.27c0.19 0.17 0.19 0.47 0 0.64z"></path>
            </svg>
          </div>
        </div>
        
        {/* Partie droite - Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
          {/* Élément décoratif */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100 rounded-bl-full opacity-40"></div>
          
          <div className="text-center mb-8 relative">
            <h2 className="text-3xl font-bold text-amber-800 mb-3 tracking-tight">Connexion</h2>
            <p className="text-amber-700 text-lg">Retrouvez vos pièces favorites</p>
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-amber-500 rounded-full"></div>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-amber-800 mb-1 ml-1">Adresse e-mail</label>
              <div className="relative group">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="w-full pl-5 pr-3 py-4 border-2 border-amber-200 rounded-xl bg-amber-50/50 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all duration-300 placeholder-amber-300"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-400 group-hover:text-amber-600 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Password input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-amber-800 mb-1 ml-1">Mot de passe</label>
                <Link to="/forgot-password" className="text-sm text-amber-600 hover:text-amber-800 transition-colors duration-300 hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <div className="relative group">
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-5 pr-12 py-4 border-2 border-amber-200 rounded-xl bg-amber-50/50 focus:ring-amber-500 focus:border-amber-500 focus:outline-none transition-all duration-300 placeholder-amber-300"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-amber-400 hover:text-amber-600 transition-colors" onClick={() => setVisible(!visible)}>
                  {visible ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="peer sr-only"
                />
                <div className="h-5 w-5 border-2 border-amber-300 rounded peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors duration-300 flex items-center justify-center">
                  <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <label htmlFor="remember" className="ml-3 block text-sm text-amber-700 cursor-pointer select-none">
                  Se souvenir de moi
                </label>
              </div>
            </div>
            
            {/* Login button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-6 flex justify-center items-center bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="flex items-center">
                  <span>Se connecter</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>
          
          {/* Separator stylisé */}
          <div className="my-8 flex items-center">
            <div className="flex-grow border-t border-amber-200"></div>
            <div className="mx-4 px-4 py-1 rounded-full bg-amber-100 text-amber-600 text-sm font-medium">OU</div>
            <div className="flex-grow border-t border-amber-200"></div>
          </div>
          
          {/* Sign up link avec effet de hover */}
          <div className="text-center relative group">
            <p className="text-amber-700">
              Première visite ? 
              <Link to="/sign-up" className="relative inline-block ml-2 font-medium text-amber-600 group-hover:text-amber-800 transition-colors duration-300">
                Créer un compte
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </p>
            
            {/* Badge décoratif */}
            <div className="absolute -right-4 -bottom-10 transform rotate-12 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-lg opacity-70">
              REJOIGNEZ-NOUS
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;