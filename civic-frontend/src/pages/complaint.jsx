/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import axios from "axios";
import { useEffect } from 'react';
import { UserContext } from '../context/user.context';
import { useContext } from 'react';
import { Socketcontext } from '../context/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, User, Phone, AlertTriangle, Loader2, CheckCircle, AlertCircle, X, Sparkles, Navigation, Upload } from 'lucide-react';

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
    y: [-5, 5, -5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function ComplaintForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [problemType, setProblemType] = useState('garbage');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [latLng, setLatLng] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [geolocating, setGeolocating] = useState(false);
  const fileInputRef = useRef(null);
  
  const data = useContext(UserContext);
  const {sendmessage, getmessage} = useContext(Socketcontext);
    
  useEffect(() => {
    sendmessage("join", {
      userType: "user",
      userId: data.user?._id
    });
  }, []);
  
  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    if (f) setPreview(URL.createObjectURL(f));
    else setPreview(null);
  }

  function handleRemoveImage() {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

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
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/map/address?lat=${lat}&lng=${lng}`, {
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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !phone) {
      setMessage({ type: 'error', text: 'Please fill name and phone number.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('phone', phone);
      
      
      if (latLng) {
        form.append('lat', latLng.lat);
        form.append('lon', latLng.lng);
        form.append('address', address || '');
      }
      
      if (file) form.append('media', file);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/complaint/createcomplaint`, 
        form,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 200) throw new Error("error");
      
      const data = await res.data;
      setMessage({ 
        type: 'success', 
        text: `Complaint submitted successfully! Your reference ID: ${data.complaintId || data.id || 'N/A'}` 
      });

      // Reset form
      setName('');
      setPhone('');
      setProblemType('garbage');
      setFile(null);
      setPreview(null);
      setLatLng(null);
      setAddress('');
      
    } catch (err) {
      console.error('Submit error', err);
      setMessage({ 
        type: 'error', 
        text: 'Submission failed. Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const problemTypes = [
    { value: 'garbage', label: 'Garbage Issue', icon: '🗑️' },
    { value: 'pothole', label: 'Pothole', icon: '🕳️' },
    { value: 'water', label: 'Water Problem', icon: '💧' },
    { value: 'electricity', label: 'Electricity Issue', icon: '⚡' },
    { value: 'road', label: 'Road Damage', icon: '🛣️' },
    { value: 'other', label: 'Other Issue', icon: '📌' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-8 px-4 relative overflow-hidden">
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: "spring" }}
        className="max-w-2xl mx-auto relative z-10"
      >
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-4 shadow-2xl"
          >
            <AlertTriangle className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
            Report an Issue
          </h1>
          <p className="text-gray-600 text-lg">Help us make your community cleaner and safer</p>
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
                <Sparkles className="w-6 h-6 mr-2 text-yellow-300" />
                Civic Issue Report
              </h2>
              <p className="text-blue-100">Fill in the details to report a community issue</p>
            </div>
          </div>

          <div className="p-8">
            <AnimatePresence>
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
                      <AlertCircle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <span className="flex-1 font-medium">{message.text}</span>
                  <button 
                    onClick={() => setMessage(null)}
                    className="ml-4 text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-black/5"
                  >
                    <X className="w-5 h-5" />
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
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <User className="w-4 h-4 mr-2 text-blue-500" />
                    Your Name *
                  </label>
                  <div className="relative">
                    <input 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-gray-50/50" 
                      placeholder="Full name" 
                      required
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-500" />
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
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  </div>
                </div>
              </motion.div>

              {/* Problem Type Selection */}
              

              {/* Photo Upload Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <Camera className="w-4 h-4 mr-2 text-purple-500" />
                  Photo Evidence
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {/* Upload Button */}
                  <motion.label 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-all duration-300 bg-gray-50/50 hover:bg-blue-50/50">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm font-medium text-gray-600">Click to upload photo</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG (Max 5MB)</p>
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </motion.label>
                  
                  {/* Preview */}
                  {preview && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative"
                    >
                      <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-blue-200 shadow-lg">
                        <img 
                          src={preview} 
                          alt="preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Location Section */}
              <motion.div variants={itemVariants} className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-red-500" />
                  Location Detection
                </label>
                
                <div className="flex gap-3">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    onClick={detectLocation} 
                    disabled={geolocating}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {geolocating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Detecting Location...
                      </>
                    ) : (
                      <>
                        <Navigation className="w-5 h-5 mr-2" />
                        Auto-Detect My Location
                      </>
                    )}
                  </motion.button>
                  
                  {latLng && (
                    <motion.button 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      type="button" 
                      onClick={() => { setLatLng(null); setAddress(''); }} 
                      className="px-6 py-4 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-sm"
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
                        <MapPin className="w-4 h-4 mr-2" />
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
                className="pt-4"
              >
                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl disabled:opacity-50 flex items-center justify-center text-lg shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"></div>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin relative z-10" />
                      <span className="relative z-10">Submitting Complaint...</span>
                    </>
                  ) : (
                    <span className="relative z-10 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Submit Complaint
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
          <p>We'll address your issue within 24 hours. Thank you for your contribution!</p>
        </motion.div>
      </motion.div>
    </div>
  );
}