/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/user.context";
import { Socketcontext } from "../context/socket";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiFilter,
  HiRefresh,
  HiClock,
  HiUser,
  HiLocationMarker,
  HiExclamation,
  HiCheckCircle,
  HiUserCircle,
  HiCalendar,
  HiTrendingUp
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

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export const UserComplaintpage = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, resolved: 0 });
  
  const data = useContext(UserContext);
  const { sendmessage, getmessage } = useContext(Socketcontext);

  useEffect(() => {
    console.log(data.user._id);
    sendmessage("join", {
      userType: "user",
      userId: data.user._id
    });
    
    getmessage("complaint-come", (complaint) => {
      setComplaints(prev => [...prev, complaint]);
      calculateStats([...complaints, complaint]);
    });
    
    try {
      axios.get(`${import.meta.env.VITE_API_URL}/complaint/usercomplaint/?id=${data.user._id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`
        }
      }).then((response) => {
        setComplaints(response.data.complaint);
        calculateStats(response.data.complaint);
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const calculateStats = (complaintsData) => {
    const total = complaintsData.length;
    const pending = complaintsData.filter(c => c.status === "Pending").length;
    const assigned = complaintsData.filter(c => c.status === "Assigned").length;
    const resolved = complaintsData.filter(c => c.status === "Resolved").length;
    
    setStats({ total, pending, assigned, resolved });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getProgressStatus = (status) => {
    switch(status) {
      case "Pending":
        return { reported: true, assigned: false, resolved: false, width: "33%" };
      case "Assigned":
        return { reported: true, assigned: true, resolved: false, width: "66%" };
      case "Resolved":
        return { reported: true, assigned: true, resolved: true, width: "100%" };
      default:
        return { reported: false, assigned: false, resolved: false, width: "0%" };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending":
        return { icon: "⏳", color: "yellow", bg: "from-yellow-400 to-orange-400" };
      case "Assigned":
        return { icon: "👷", color: "blue", bg: "from-blue-400 to-indigo-400" };
      case "Resolved":
        return { icon: "✅", color: "green", bg: "from-green-400 to-teal-400" };
      default:
        return { icon: "📋", color: "gray", bg: "from-gray-400 to-gray-500" };
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case "garbage":
        return "🗑️";
      case "pothole":
        return "🕳️";
      case "water":
        return "💧";
      default:
        return "📌";
    }
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case "high":
        return "text-red-600 bg-red-100 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-100 border-green-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status.toLowerCase() === statusFilter;
    const typeMatch = typeFilter === 'all' || complaint.problem_type === typeFilter;
    return statusMatch && typeMatch;
  });

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 p-4 md:p-6 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-b-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                My Complaints
              </h1>
              <p className="text-gray-600 flex items-center">
                <HiUserCircle className="w-5 h-5 mr-2 text-blue-500" />
                Track and manage your submitted complaints
              </p>
            </div>
            
            {/* User Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {data.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{data.user?.name || "User"}</p>
                  <p className="text-sm text-gray-600">{data.user?.email || "user@example.com"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
          >
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <HiTrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <HiClock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <HiUser className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <HiCheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Filter Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <HiFilter className="w-5 h-5 mr-2 text-blue-500" />
                Filter Complaints
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative">
                  <select 
                    className="pl-10 pr-4 py-2.5 border-0 bg-blue-50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <HiClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <div className="relative">
                  <select 
                    className="pl-10 pr-4 py-2.5 border-0 bg-blue-50 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none w-full"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="all">All Types</option>
                    <option value="garbage">Garbage</option>
                    <option value="pothole">Pothole</option>
                    <option value="water">Water Issue</option>
                  </select>
                  <HiExclamation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                
                <button 
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  onClick={resetFilters}
                >
                  <HiRefresh className="w-4 h-4 mr-2" />
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        </motion.header>

        {/* Complaints Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 flex justify-between items-center mt-8"
        >
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📋</span> 
            {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''} Found
          </h2>
        </motion.div>
        
        <AnimatePresence>
          {filteredComplaints.length > 0 ? (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredComplaints.map((complaint, index) => {
                const progress = getProgressStatus(complaint.status);
                const statusInfo = getStatusIcon(complaint.status);
                
                return (
                  <motion.div
                    key={complaint._id}
                    variants={cardVariants}
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    transition={{ delay: index * 0.1 }}
                    className="bg-white relative   rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group"
                  >
                    {/* Status Ribbon */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 shadow-lg bg-gradient-to-r ${statusInfo.bg}`}>
                      <span className="mr-1">{statusInfo.icon}</span> {complaint.status}
                    </div>
                    
                    {/* Image Section */}
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={complaint.media} 
                        alt={complaint.problem_type}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-3 left-4 flex items-center">
                        <span className="text-2xl mr-2">{getTypeIcon(complaint.problem_type)}</span>
                        <span className="text-white font-semibold capitalize">{complaint.problem_type}</span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-5">
                      <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{complaint.title || "Untitled Complaint"}</h2>
                      <p className="text-gray-600 text-sm mb-4 flex items-center">
                        <HiLocationMarker className="w-4 h-4 mr-1" />
                        {complaint.address}
                      </p>
                      
                      <p className="text-gray-700 mb-4 line-clamp-2">{complaint.description}</p>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-blue-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Severity</p>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityColor(complaint.severity_level)}`}>
                            {complaint.severity_level}
                          </span>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-2">
                          <p className="text-xs text-gray-500">Department</p>
                          <p className="font-semibold text-gray-800 capitalize">{complaint.department.replace('_', ' ')}</p>
                        </div>
                      </div>
                      
                      {/* Assigned Worker Info */}
                      {complaint.assignedWorker && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-600 font-semibold mb-1">Assigned To:</p>
                          <p className="text-sm text-green-800">{complaint.assignedWorker}</p>
                        </div>
                      )}
                      
                      {/* Progress Bar - Fixed Alignment */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span className={progress.reported ? "text-green-600 font-semibold" : ""}>Reported</span>
                          <span className={progress.assigned ? "text-green-600 font-semibold" : ""}>Assigned</span>
                          <span className={progress.resolved ? "text-green-600 font-semibold" : ""}>Resolved</span>
                        </div>
                        
                        {/* Progress Bar Container */}
                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div className="text-right flex w-full justify-between">
                              {/* Progress Line Background */}
                              <div className="absolute top-3 left-0 right-0 h-1 bg-gray-200 rounded-full"></div>
                              
                              {/* Progress Line Fill */}
                              <div 
                                className={`absolute top-3 left-0 h-1 rounded-full transition-all duration-500 ${
                                  complaint.status === 'Pending' ? 'bg-yellow-500' :
                                  complaint.status === 'Assigned' ? 'bg-blue-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: progress.width }}
                              ></div>
                              
                              {/* Progress Dots */}
                              <div className="relative flex justify-between w-full">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                                  progress.reported ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 text-gray-600'
                                }`}>
                                  1
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                                  progress.assigned ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 text-gray-600'
                                }`}>
                                  2
                                </div>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold z-10 ${
                                  progress.resolved ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-300 text-gray-600'
                                }`}>
                                  3
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Footer - Fixed User Name Display */}
                    <div className="px-5 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                          {data.user?.name?.charAt(0) || "U"}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {data.user?.name || "User"}
                        </span>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <HiCalendar className="w-3 h-3 mr-1" />
                        {formatDate(complaint.createdAt)}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20"
            >
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No complaints found</h3>
              <p className="text-gray-500 mb-6">No complaints match the selected filters.</p>
              <button 
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};