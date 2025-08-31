/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import axios from "axios";
import { Usesocket } from '../context/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, Mail, MapPin, Building, Lock, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

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

export default function OfficerForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [latLng, setLatLng] = useState(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [geolocating, setGeolocating] = useState(false);

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

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !phone || !department || !email || !password || !city) {
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
      form.append('city', city);
      form.append('password', password);
      
      if (latLng) {
        form.append('lat', latLng.lat);
        form.append('lon', latLng.lng);
        form.append('address', address || '');
      }

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/officer/create`, 
        form, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token'))}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status !== 201) throw new Error("error");
      
      const data = await res.data;
      setMessage({ 
        type: 'success', 
        text: `Officer created successfully! ID: ${data.officer?.id || data.id || 'N/A'}` 
      });

      // Reset form
      setName('');
      setPhone('');
      setDepartment('');
      setEmail('');
      setCity('');
      setPassword('');
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
          <h2 className="text-2xl font-bold">Create New Officer</h2>
          <p className="text-blue-100 mt-1">Add a new officer to the system</p>
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
                  <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                )}
                <span>{message.text}</span>
                <button 
                  onClick={() => setMessage(null)}
                  className="ml-auto"
                >
                  <X className="w-4 h-4" />
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
                  <User className="w-4 h-4 mr-2" />
                  Full Name
                </label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Officer's full name" 
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Phone Number
                </label>
                <input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="10-digit phone number" 
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input 
                  type="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Officer's email address" 
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Password
                </label>
                <input 
                  type="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Set a password" 
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Department
                </label>
                <input 
                  value={department} 
                  onChange={(e) => setDepartment(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Officer's department" 
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  City
                </label>
                <input 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="City of operation" 
                />
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
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
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4 mr-2" />
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
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Officer...
                    </>
                  ) : (
                    'Create Officer'
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