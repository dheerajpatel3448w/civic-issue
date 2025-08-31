/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import axios from "axios";
import { useEffect } from 'react';
import { UserContext } from '../context/user.context';
import { useContext } from 'react';
import { Socketcontext } from '../context/socket';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, User, Phone, FileText, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';

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

export default function ComplaintForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
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
    if (!name || !phone || !description) {
      setMessage({ type: 'error', text: 'Please fill name, phone and description.' });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const form = new FormData();
      form.append('name', name);
      form.append('phone', phone);
      form.append('description', description);
      
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
      setDescription('');
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-2xl font-bold">Report Civic Issue</h2>
          <p className="text-blue-100 mt-1">Help us make your community better</p>
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
                  Your Name
                </label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  placeholder="Full name" 
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
                  <FileText className="w-4 h-4 mr-2" />
                  Description
                </label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                  rows={4} 
                  placeholder="Describe the issue in detail"
                ></textarea>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <Camera className="w-4 h-4 mr-2" />
                  Photo Evidence
                </label>
                <div className="mt-1 flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <span className="px-4 py-2.5 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors flex items-center">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </span>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  
                  {preview && (
                    <button 
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                {preview && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 relative inline-block"
                  >
                    <img 
                      src={preview} 
                      alt="preview" 
                      className="w-48 h-48 object-cover rounded-lg border shadow-sm" 
                    />
                  </motion.div>
                )}
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
                        Detect my location
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
                  disabled={isSubmitting}
                  className="w-full px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium rounded-lg disabled:opacity-50 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Complaint'
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