/* eslint-disable no-unused-vars */
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import zxcvbn from "zxcvbn";
import { useNavigate } from "react-router-dom";

// ----------------------
// Schema & Types
// ----------------------
const schema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(60, "Name is too long"),
  email: z
    .string()
    .email("Please enter a valid email"),
  phone: z
    .string()
    .trim()
    .min(10, "Phone must be at least 10 digits")
    .max(10, "Phone must be at most 10 digits")
    .regex(/^[+]?\d{10}$/i, "Use digits only, optional leading +"),
  password: z
    .string()
    .min(8, "Min 8 characters")
    .regex(/[a-z]/, "Add a lowercase letter")
    .regex(/[A-Z]/, "Add an uppercase letter")
    .regex(/\d/, "Add a number")
    .regex(/[^\w\s]/, "Add a special character"),
});




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

const PasswordStrength = ({ value = "" }) => {
  const score = useMemo(() => (value ? zxcvbn(value).score : 0), [value]); // 0..4
  const labels = ["Very weak", "Weak", "Fair", "Strong", "Very strong"]; // map score
  return (
    <div className="mt-2">
      <div className="grid grid-cols-4 gap-1 h-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`rounded-full transition-all ${
              i <= score - 1 ? "bg-green-500" : "bg-neutral-300 dark:bg-neutral-700"
            }`}
          />
        ))}
      </div>
      <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
        Strength: {labels[score]}
      </p>
    </div>
  );
};


export default function Register() {
    const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({ resolver: zodResolver(schema), mode: "onChange" });

  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);

  const passwordValue = watch("password") || "";

  const onSubmit = async (data) => {
    setDone(false);
    
    await new Promise((res) => setTimeout(res, 1200));
    console.log("Registered:", data);
  try {
    const response = await axios.post(`${ import.meta.env.VITE_API_URL}/user/register`, data,{
        withCredentials:true,
       
    });
    console.log("Registration successful:", response.data);
    if(response.data.success){
        navigate("/login");

    }
  } catch (error) {
    console.error("Registration failed:", error);
  }
    setDone(true);
    reset({ name: data.name, email: data.email, phone: data.phone, password: "" });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-600 via-fuchsia-600 to-rose-500 dark:from-neutral-900 dark:via-neutral-950 dark:to-black flex items-center justify-center p-4">
    
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 grid place-items-center text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white">
                Create your account
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Join our shop to track orders, wishlist, and more.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Name */}
            <Field label="Full name" icon={User} error={errors?.name?.message}>
              <input
                type="text"
                autoComplete="name"
                className="w-full pl-10 pr-3 h-11 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Dheeraj Patel"
                {...register("name")}
              />
            </Field>

            {/* Email */}
            <Field label="Email" icon={Mail} error={errors?.email?.message}>
              <input
                type="email"
                autoComplete="email"
                className="w-full pl-10 pr-3 h-11 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="you@example.com"
                {...register("email")}
              />
            </Field>

            {/* Phone */}
            <Field label="Phone" icon={Phone} error={errors?.phone?.message}>
              <input
                type="tel"
                inputMode="numeric"
                pattern="^[+]?\d{10,15}$"
                autoComplete="tel"
                className="w-full pl-10 pr-3 h-11 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="+919876543210"
                {...register("phone")}
              />
            </Field>

            {/* Password */}
            <Field label="Password" icon={Lock} error={errors?.password?.message}>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/60 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-violet-500 mt-5 mb-1"
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
              <PasswordStrength value={passwordValue} />
            </Field>

            <motion.button
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-full h-11 rounded-xl font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-600 to-fuchsia-600 shadow-lg shadow-fuchsia-600/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                </span >
              ) : (
                "Create account"
              )}
            </motion.button>

            {done && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm rounded-xl bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 px-3 py-2"
              >
                <span className="font-medium">Success!</span> Your account has been created.
              </motion.div>
            )}

            <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
              By creating an account, you agree to our
              <a className="mx-1 underline underline-offset-4" href="#">Terms</a>
              and
              <a className="ml-1 underline underline-offset-4" href="#">Privacy Policy</a>.
            </p>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-white/80">
          Already have an account? <a href="#" className="underline underline-offset-4">Sign in</a>
        </p>
      </motion.div>
    </div>
  );
}

