/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../context/user.context";
import { Link, useNavigate } from "react-router-dom";
// ----------------------
// Schema & Types
// ----------------------
const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// ----------------------
// Small UI helpers
// ----------------------
const Field = ({ label, icon: Icon, children, error }) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-200">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
      )}
      {children}
    </div>
    {error && (
      <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
    )}
  </div>
);


export default function Login() {
  const {user, setUser} = useContext(UserContext);
  const navigate  =useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const onSubmit = async (data) => {
    setDone(false);
    await new Promise((res) => setTimeout(res, 1200));
    console.log("Logged in:", data);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, data, {
        withCredentials:true
      })
      if(response.data.success) {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        setUser(response.data.user);
        console.log("ok")
        navigate("/");
      
      }
    } catch (error) {
      console.error("Login failed:", error);
      return;
      
    }
    setDone(true);
    reset({ email: data.email, password: "" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-600 dark:from-neutral-900 dark:via-neutral-950 dark:to-black flex items-center justify-center p-4">
      {/* Background accents */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <motion.div
          className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          animate={{ y: [0, 12, 0], x: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        <motion.div
          className="absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-black/10 dark:bg-white/10 blur-3xl"
          animate={{ y: [0, -10, 0], x: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        />
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/80 dark:bg-neutral-900/70 shadow-2xl ring-1 ring-black/10 dark:ring-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 grid place-items-center text-white">
              <LogIn className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white">
                Welcome back
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Sign in to continue shopping with us.
              </p>
             
            </div>
          </div>


          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Email */}
            <Field label="Email" icon={Mail} error={errors?.email?.message}>
              <input
                type="email"
                autoComplete="email"
                className="w-full pl-10 pr-3 h-11 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="you@example.com"
                {...register("email")}
              />
            </Field>

            {/* Password */}
            <Field label="Password" icon={Lock} error={errors?.password?.message}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="w-full pl-10 pr-10 h-11 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </Field>

            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-11 rounded-xl font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-600 to-blue-600 shadow-lg shadow-blue-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </motion.button>

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm rounded-xl bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-2"
              >
                <span className="font-medium">Success!</span> You are now logged in.
              </motion.div>
            )}

            <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400">
             <a href="/officerlogin" className="underline underline-offset-4">
                sign via officer
              </a>
              <Link to="/register" className="underline underline-offset-4">
                Create account
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

