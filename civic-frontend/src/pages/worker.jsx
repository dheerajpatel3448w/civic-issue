3/* eslint-disable no-unused-vars */
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
  HiChip
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
      stiffness: 100
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
  const featureRef = useRef(null);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Create New Worker</h2>
          <p className="text-blue-100 mt-1">Add a new worker to the system</p>
        </div>

        <div className="p-6">
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mb-6 p-4 rounded-lg flex items-start ${
                  message.type === 'error' 
                    ? 'bg-red-50 text-red-800 border border-red-200' 
                    : 'bg-green-50 text-green-800 border border-green-200'
                }`}
              >
                {message.type === 'error' ? (
                  <div className="bg-red-100 p-2 rounded-full mr-3">
                    <div className="w-5 h-5 text-red-600">!</div>
                  </div>
                ) : (
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <HiCheck className="w-5 h-5 text-green-600" />
                  </div>
                )}
                <span className="flex-1">{message.text}</span>
                <button 
                  onClick={() => setMessage(null)}
                  className="ml-2 text-gray-500 hover:text-gray-700"
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
          >
            <div className="space-y-5">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <HiUser className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Worker's full name" 
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <HiPhone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="10-digit phone number" 
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <HiMail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Worker's email address" 
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <HiOfficeBuilding className="w-4 h-4 mr-2" />
                  Department
                </label>
                <input 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Worker's department" 
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <HiChip className="w-4 h-4 mr-2" />
                  Skills
                </label>
                
                <div className="flex items-center gap-2 mt-1">
                  <input
                    ref={featureRef}
                    placeholder="Add a skill (press +)"
                    className="flex-1 rounded-lg p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAddFeature}
                    className="inline-flex items-center gap-2 rounded-lg px-4 py-3 bg-indigo-600 text-white shadow hover:bg-indigo-700 transition-colors"
                  >
                    <HiPlus /> 
                  </motion.button>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {features.map((f, i) => (
                    <motion.span
                      key={f + i}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-indigo-800"
                    >
                      <span className="text-sm">{f}</span>
                      <button 
                        type="button" 
                        onClick={() => onRemoveFeature(i)} 
                        title="Remove" 
                        className="text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <HiLocationMarker className="w-4 h-4 mr-2" />
                  Location
                </label>
                <div className="flex gap-2 mt-1">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" 
                    onClick={detectLocation} 
                    disabled={geolocating}
                    className="px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50 flex items-center"
                  >
                    {geolocating ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <HiLocationMarker className="w-4 h-4 mr-2" />
                        Detect Location
                      </>
                    )}
                  </motion.button>
                  
                  {latLng && (
                    <button 
                      type="button" 
                      onClick={() => { setLatLng(null); setAddress(''); }} 
                      className="px-4 py-2.5 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                {latLng && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="text-sm text-blue-800">
                      <div className="font-medium">Coordinates:</div>
                      <div>Lat: {latLng.lat.toFixed(6)}</div>
                      <div>Lng: {latLng.lng.toFixed(6)}</div>
                      
                      {address && (
                        <>
                          <div className="font-medium mt-2">Address:</div>
                          <div>{address}</div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div variants={itemVariants} className="pt-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit" 
                  disabled={loading}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating Worker...
                    </>
                  ) : (
                    'Create Worker'
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}