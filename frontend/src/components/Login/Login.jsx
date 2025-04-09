

import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server.js";
import { toast } from "react-toastify";
import { AiOutlineCheckCircle, AiOutlineUser, AiOutlineLock } from "react-icons/ai";

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
          console.log("✅ userId stocké dans localStorage :", response.data.user._id);
      } else {
          console.error("❌ Aucun userId reçu !");
      }
      
        axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      } else {
        console.error("Aucun token reçu !");
      }

      toast.success("Connexion réussie !");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      console.error("Erreur de connexion :", err.response?.data?.message || err);
      toast.error(err.response?.data?.message || "Erreur lors de la connexion. Veuillez vérifier vos identifiants.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F0] px-4 py-10">
      {/* Conteneur principal avec effet d'ombre et bordure */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row overflow-hidden rounded-2xl shadow-xl bg-white border border-[#EDDFCF]">
        
        {/* Partie gauche : Image et branding */}
        <div className="w-full md:w-1/2 relative overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center"
               style={{ backgroundImage: "url('/boutique_clothing_store.jpg')" }}>
          </div>
          
          {/* Overlay avec le logo et slogan */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#5C4033]/80 to-transparent flex flex-col justify-end p-8">
            <div className="bg-white/90 rounded-lg p-6 backdrop-blur-sm">
              <h1 className="text-2xl font-bold text-[#5C4033] mb-2">REWEAR</h1>
              <p className="text-[#8B5E3C]">Seconde main, premier choix</p>
            </div>
          </div>
        </div>
        
        {/* Partie droite : Formulaire */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#5C4033] mb-2">Connexion</h2>
            <p className="text-[#8B5E3C]">Accédez à votre espace Rewear</p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5C4033] mb-1">Adresse e-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineUser className="text-[#8B5E3C]" size={20} />
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
            
            {/* Password input */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-[#5C4033] mb-1">Mot de passe</label>
                <Link to="/forgot-password" className="text-sm text-[#D2691E] hover:underline">
                  Mot de passe oublié?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AiOutlineLock className="text-[#8B5E3C]" size={20} />
                </div>
                <input
                  type={visible ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Entrez votre mot de passe"
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
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-[#D2691E] rounded border-[#EDDFCF] focus:ring-[#D2691E]"
              />
              <label htmlFor="remember" className="ml-2 block text-sm text-[#5C4033]">
                Se souvenir de moi
              </label>
            </div>
            
            {/* Login button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 flex justify-center items-center bg-[#D2691E] text-white font-semibold rounded-lg hover:bg-[#A0522D] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D2691E]"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>
          
          {/* Separator */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-[#EDDFCF]"></div>
            <span className="mx-4 text-sm text-[#8B5E3C]">OU</span>
            <div className="flex-grow border-t border-[#EDDFCF]"></div>
          </div>
          
          {/* Sign up link */}
          <div className="text-center">
            <p className="text-[#5C4033]">
              Pas encore de compte ? 
              <Link to="/sign-up" className="ml-1 font-medium text-[#D2691E] hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

