"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, UserPlus, ShieldCheck } from "lucide-react";
import apiClient from "@/lib/api-client";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  defaultIsLogin?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, defaultIsLogin = true }) => {
  const [isLogin, setIsLogin] = useState(defaultIsLogin);
  const [role, setRole] = useState("Tourist");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (isOpen) {
      setIsLogin(defaultIsLogin);
    }
  }, [isOpen, defaultIsLogin]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { ...formData, role: role };

      const response = await apiClient.post(endpoint, payload);
      const user = response.data as any;
      
      localStorage.setItem("token", user.token);
      localStorage.setItem("user", JSON.stringify(user));
      
      onSuccess(user);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="glass w-full max-w-md overflow-hidden rounded-3xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100/20 transition-colors z-10"
        >
          <X size={20} className="text-gray-500" />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-center mb-6">
             <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                {isLogin ? <User size={24} /> : <UserPlus size={24} />}
             </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-2 font-jakarta">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-500 text-center mb-8 text-sm">
            {isLogin ? "Sign in to access your travel plans" : "Join the premium tourism network of Sri Lanka"}
          </p>

          <div className="flex bg-gray-100/50 p-1 rounded-2xl mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                isLogin ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
                !isLogin ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="fullName"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      required={!isLogin}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full bg-white/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-jakarta"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase ml-1">I am a...</label>
                    <div className="grid grid-cols-2 gap-2">
                      {["Tourist", "Guide", "VehicleOwner", "HotelOwner"].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRole(r)}
                          className={`py-2 px-3 text-xs rounded-xl border transition-all ${
                            role === r 
                              ? "bg-primary/10 border-primary text-primary font-semibold" 
                              : "bg-white/50 border-gray-200 text-gray-500 hover:border-gray-300"
                          }`}
                        >
                          {r.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-jakarta"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-white/50 border border-gray-200 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-jakarta"
              />
            </div>

            {error && (
              <p className="text-rose-500 text-xs text-center font-medium mt-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full hero-gradient text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 mt-6 active:scale-95 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck size={20} />
                  <span>{isLogin ? "Sign In" : "Get Started"}</span>
                </>
              )}
            </button>
          </form>

          <p className="text-gray-400 text-xs text-center mt-6">
            By continuing, you agree to our <span className="text-primary hover:underline cursor-pointer">Terms of Service</span> and <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
