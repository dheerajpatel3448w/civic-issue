/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiPlus, 
  HiTrash, 
  HiPhotograph, 
  HiCheck, 
  HiUser, 
  HiPhone, 
  HiMail, 
  HiOfficeBuilding,
  HiLocationMarker,
  HiChip,
  HiIdentification,
  HiStar,
  HiSparkles
} from "react-icons/hi";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const floatingVariants = {
  float: {
    y: [-10, 10, -10],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function WorkerForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [geolocating, setGeolocating] = useState(false);
  const [features, setFeatures] = useState(["Active Noise Cancellation"]);
  const [activeStep, setActiveStep] = useState(1);
  const featureRef = useRef(null);

  const steps = [
    { number: 1, label: "Basic Info", icon: HiUser },
    { number: 2, label: "Skills", icon: HiChip },
    { number: 3, label: "Location", icon: HiLocationMarker }
  ];

  async function detectLocation() {
    if (!navigator.geolocation) {
      setMessage({ type: 'error', text: 'Geolocation is not supported in this browser.' });
      return;
    }
    
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatLng({ lat, lng });

        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/map/address?lat=${lat}&lng=${lng}`,{
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
          });
          
          if (res.status === 200) {
            const data = await res.data;
            setAddress(data.address || data.formatted_address || '');
          } else {
            setAddress('');
          }
        } catch (err) {
          console.error('Reverse geocode error', err);
          setAddress('');
        }

        setGeolocating(false);
      },
      (err) => {
        console.error('Geo error', err);
        setMessage({ type: 'error', text: 'Could not get location. Please allow location access or enter manually.' });
        setGeolocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function onAddFeature(e) {
    e.preventDefault();
    const v = featureRef.current?.value?.trim();
    if (v && !features.includes(v)) {
      setFeatures((s) => [...s, v]);
      featureRef.current.value = "";
    }
  }
  
  function onRemoveFeature(idx) {
    setFeatures((s) => s.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !phone || !department || !email) {
      setMessage({ type: 'error', text: 'Please fill all required fields.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('phone', phone);
      form.append('department', department);
      form.append('email', email);
      
      if (latLng) {
        form.append('lat', latLng.lat);
        form.append('lon', latLng.lng);
        form.append('address', address || '');
      }
      
      form.append("skills", JSON.stringify(features));

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/worker/create`, 
        form, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 201) throw new Error("error");
      
      const data = await res.data;
      setMessage({ 
        type: 'success', 
        text: `Worker created successfully! ID: ${data.worker?.id || data.id || 'N/A'}` 
      });

      // Reset form
      setName('');
      setPhone('');
      setDepartment('');
      setEmail('');
      setFeatures([]);
      setLatLng(null);
      setAddress('');
      setActiveStep(1);
      
    } catch (err) {
      console.error('Submit error', err);
      setMessage({ 
        type: 'error', 
        text: 'Submission failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div 
        variants={floatingVariants}
        animate="float"
        className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"
      />
      <motion.div 
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 1 }}
        className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-xl"
      />
      <motion.div 
        variants={floatingVariants}
        animate="float"
        transition={{ delay: 2 }}
        className="absolute top-1/2 left-1/3 w-16 h-16 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-lg"
      />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-2xl mx-auto relative z-10"
      >
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <HiIdentification className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Create New Worker
          </h1>
          <p className="text-gray-600 text-lg">Add a talented worker to your team</p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <div className="flex space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                    activeStep >= step.number 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-110'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 transition-all duration-300 ${
                      activeStep > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 flex items-center">
                <HiSparkles className="w-6 h-6 mr-2 text-yellow-300" />
                Worker Information
              </h2>
              <p className="text-blue-100">Fill in the details to register a new worker</p>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={`mb-6 p-4 rounded-2xl flex items-center shadow-lg ${
                    message.type === 'error' 
                      ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-200' 
                      : 'bg-gradient-to-r from-green-50 to-teal-50 border border-green-200'
                  }`}
                >
                  <div className={`p-3 rounded-full mr-4 ${
                    message.type === 'error' ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {message.type === 'error' ? (
                      <div className="w-6 h-6 text-red-600 font-bold">!</div>
                    ) : (
                      <HiCheck className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <span className="flex-1 font-medium">{message.text}</span>
                  <button 
                    onClick={() => setMessage(null)}
                    className="ml-4 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-black/5"
                  >
                    ×
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Basic Information Grid */}
              <motion.div 
                variants={itemVariants}
                onFocus={() => setActiveStep(1)}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <HiUser className="w-4 h-4 mr-2 text-blue-500" />
                    Full Name *
                  </label>
                  <div className="relative">
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50" 
                      placeholder="Worker's full name" 
                      required
                    />
                    <HiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <HiPhone className="w-4 h-4 mr-2 text-green-500" />
                    Phone Number *
                  </label>
                  <div className="relative">
                    <input 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value)} 
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50" 
                      placeholder="10-digit phone number" 
                      required
                    />
                    <HiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <HiMail className="w-4 h-4 mr-2 text-purple-500" />
                    Email Address *
                  </label>
                  <div className="relative">
                    <input 
                      type="email"
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50" 
                      placeholder="worker@example.com" 
                      required
                    />
                    <HiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <HiOfficeBuilding className="w-4 h-4 mr-2 text-orange-500" />
                    Department *
                  </label>
                  <div className="relative">
                    <input 
                      value={department} 
                      onChange={(e) => setDepartment(e.target.value)} 
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50" 
                      placeholder="e.g., Sanitation, Maintenance" 
                      required
                    />
                    <HiOfficeBuilding className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </motion.div>

              {/* Skills Section */}
              <motion.div 
                variants={itemVariants}
                onFocus={() => setActiveStep(2)}
                className="space-y-4"
              >
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <HiChip className="w-5 h-5 mr-2 text-indigo-500" />
                  Skills & Specializations
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      ref={featureRef}
                      placeholder="Add a skill (e.g., Plumbing, Electrical)"
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50"
                    />
                    <HiChip className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddFeature}
                    className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <HiPlus className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-3">
                  {features.map((f, i) => (
                    <motion.span
                      key={f + i}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-blue-800 border border-blue-200 shadow-sm"
                    >
                      <HiStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{f}</span>
                      <button 
                        type="button" 
                        onClick={() => onRemoveFeature(i)} 
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-full hover:bg-blue-200/50"
                      >
                        <HiTrash className="w-3 h-3" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Location Section */}
              <motion.div 
                variants={itemVariants}
                onFocus={() => setActiveStep(3)}
                className="space-y-4"
              >
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <HiLocationMarker className="w-5 h-5 mr-2 text-red-500" />
                  Location Details
                </label>
                
                <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    onClick={detectLocation} 
                    disabled={geolocating}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {geolocating ? (
                      <>
                        <div className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Detecting Location...
                      </>
                    ) : (
                      <>
                        <HiLocationMarker className="w-5 h-5 mr-2" />
                        Auto-Detect Location
                      </>
                    )}
                  </motion.button>
                  
                  {latLng && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      type="button" 
                      onClick={() => { setLatLng(null); setAddress(''); }} 
                      className="px-6 py-3 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-sm"
                    >
                      Clear
                    </motion.button>
                  )}
                </div>
                
                {latLng && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-sm"
                  >
                    <div className="text-sm text-blue-800 space-y-2">
                      <div className="flex items-center font-semibold">
                        <HiLocationMarker className="w-4 h-4 mr-2" />
                        Location Detected Successfully!
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-blue-600">Latitude</div>
                          <div className="font-mono">{latLng.lat.toFixed(6)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-blue-600">Longitude</div>
                          <div className="font-mono">{latLng.lng.toFixed(6)}</div>
                        </div>
                      </div>
                      
                      {address && (
                        <div>
                          <div className="text-xs text-blue-600 mt-2">Address</div>
                          <div className="font-medium">{address}</div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Submit Button */}
              <motion.div 
                variants={itemVariants}
                className="pt-6"
              >
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"></div>
                  {loading ? (
                    <>
                      <div className="w-6 h-6 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin relative z-10" />
                      <span className="relative z-10">Creating Worker Profile...</span>
                    </>
                  ) : (
                    <span className="relative z-10 flex items-center">
                      <HiSparkles className="w-5 h-5 mr-2" />
                      Create Worker Profile
                    </span>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6 text-gray-500 text-sm"
        >
          <p>Fill in all required fields marked with * to register a new worker</p>
        </motion.div>
      </motion.div>
    </div>
  );
}