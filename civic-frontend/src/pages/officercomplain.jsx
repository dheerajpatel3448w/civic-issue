/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useContext } from "react";
import { OfficerContext } from "../context/officer.context";
import { Socketcontext } from "../context/socket";
import axios from "axios";

export const Complaintpage = () => {
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [workers, setWorkers] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showWorkerSidebar, setShowWorkerSidebar] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, resolved: 0 });
  
  const data = useContext(OfficerContext);
  const { sendmessage, getmessage } = useContext(Socketcontext);

  useEffect(() => {
    console.log(data.officer._id);
    sendmessage("join", {
      userType: "officer",
      userId: data.officer._id
    });
    
    getmessage("complaint-come", (complaint) => {
      setComplaints(prev => [...prev, complaint]);
    });
    
    try {
      axios.get(`${import.meta.env.VITE_API_URL}/complaint/allcomplaint/?id=${data.officer._id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`
        }
      }).then((response) => {
        setComplaints(response.data.complaint);
        calculateStats(response.data.complaint);
        console.log(response.data.complaint);
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
        return { reported: true, assigned: false, resolved: false, width: "0%" };
      case "Assigned":
        return { reported: true, assigned: true, resolved: false, width: "50%" };
      case "Resolved":
        return { reported: true, assigned: true, resolved: true, width: "100%" };
      default:
        return { reported: false, assigned: false, resolved: false, width: "0%" };
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "Pending":
        return "⏳";
      case "Assigned":
        return "👷";
      case "Resolved":
        return "✅";
      default:
        return "📋";
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

  const filteredComplaints = complaints.filter(complaint => {
    const statusMatch = statusFilter === 'all' || complaint.status.toLowerCase() === statusFilter;
    const typeMatch = typeFilter === 'all' || complaint.problem_type === typeFilter;
    return statusMatch && typeMatch;
  });

  const resetFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
  };

  const handleAssign = async (complaint) => {
    setLoading(true);
    setSelectedComplaint(complaint);
    
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/worker/getallworker?lat=${complaint.location.lat}&lon=${complaint.location.lon}&department=${complaint.department}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`
          }
        }
      );
      
      console.log(response.data.worker);
      setWorkers(response.data.worker);
      setShowWorkerSidebar(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const assignWorkerToComplaint = async (workerId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/complaint/assignworker`,
        {
          complaint: selectedComplaint,
          worker: workerId
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token2'))}`
          }
        }
      );
      
      setComplaints(prev => 
        prev.map(comp => 
          comp._id === selectedComplaint._id 
            ? {...comp, status: "Assigned", assignedWorker: workerId._id}
            : comp
        )
      );
      
      setShowWorkerSidebar(false);
      setSelectedComplaint(null);
      alert("Worker assigned successfully!");
    } catch (error) {
      console.log(error);
      alert("Error assigning worker");
    }
  };

  const closeWorkerSidebar = () => {
    setShowWorkerSidebar(false);
    setSelectedComplaint(null);
    setWorkers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6 relative">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-72 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-b-3xl"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Complaint Management Dashboard
              </h1>
              <p className="text-gray-600">Manage and track complaints in your area</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-xl p-2 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                {data.officer.name?.charAt(0) || "O"}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{data.officer.name || "Officer"}</p>
                <p className="text-xs text-gray-600">Area Incharge</p>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Total Complaints</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">⏳</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Assigned</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.assigned}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">👷</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="mr-2">🔍</span> Filter Complaints
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">📋</span>
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
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2">🏷️</span>
                </div>
                
                <button 
                  className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                  onClick={resetFilters}
                >
                  <span className="mr-2">🔄</span> Reset Filters
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Complaints Grid */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center">
            <span className="mr-2">📋</span> 
            {filteredComplaints.length} Complaint{filteredComplaints.length !== 1 ? 's' : ''} Found
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map(complaint => {
            const progress = getProgressStatus(complaint.status);
            const statusClass = complaint.status.toLowerCase();
            
            return (
              <div key={complaint._id} className="bg-white relative rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 group">
                {/* Status Ribbon */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 shadow-lg ${
                  statusClass === 'pending' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  statusClass === 'assigned' ? 'bg-gradient-to-r from-blue-500 to-indigo-500' :
                  'bg-gradient-to-r from-green-500 to-teal-500'
                }`}>
                  <span className="mr-1">{getStatusIcon(complaint.status)}</span> {complaint.status}
                </div>
                
                {/* Image Section */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={complaint.media} 
                    alt={complaint.problem_type}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  <div className="absolute bottom-3 left-4 flex items-center">
                    <span className="text-2xl mr-2">{getTypeIcon(complaint.problem_type)}</span>
                    <span className="text-white font-semibold capitalize">{complaint.problem_type}</span>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{complaint.title || "Untitled Complaint"}</h2>
                  <p className="text-gray-600 text-sm mb-4 flex items-center">
                    <span className="mr-1">📍</span> {complaint.address}
                  </p>
                  
                  <p className="text-gray-700 mb-4 line-clamp-2">{complaint.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Severity</p>
                      <p className={`font-semibold ${
                        complaint.severity_level === 'high' ? 'text-red-600' :
                        complaint.severity_level === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {complaint.severity_level}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">Department</p>
                      <p className="font-semibold text-gray-800 capitalize">{complaint.department.replace('_', ' ')}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Reported</span>
                      <span>Assigned</span>
                      <span>Resolved</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          statusClass === 'pending' ? 'bg-yellow-500' :
                          statusClass === 'assigned' ? 'bg-blue-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: progress.width }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <div className={`w-2 h-2 rounded-full ${progress.reported ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`w-2 h-2 rounded-full ${progress.assigned ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      <div className={`w-2 h-2 rounded-full ${progress.resolved ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  {complaint.status === "Pending" && (
                    <button 
                      onClick={() => handleAssign(complaint)}
                      className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center font-semibold"
                      disabled={loading}
                    >
                      {loading && selectedComplaint?._id === complaint._id ? (
                        <span className="flex items-center">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                          Loading...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="mr-2">👷</span> Assign Worker
                        </span>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Footer */}
                <div className="px-5 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-2">
                      {complaint.name?.charAt(0) || "U"}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{complaint.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(complaint.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredComplaints.length === 0 && (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg">No complaints match the selected filters.</p>
            <button 
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Worker Assignment Sidebar */}
      {showWorkerSidebar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-end z-50 transition-opacity duration-300">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto shadow-2xl transform transition-transform duration-300">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="mr-2">👷</span> Assign Worker
                </h2>
                <button 
                  onClick={closeWorkerSidebar}
                  className="text-white hover:text-gray-200 p-1 rounded-full bg-white/20"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mt-4 bg-white/20 rounded-xl p-3">
                <h3 className="font-semibold mb-2">Complaint Details:</h3>
                <p className="text-sm truncate">{selectedComplaint?.description}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <span>Type: {selectedComplaint?.problem_type}</span>
                  <span>Severity: {selectedComplaint?.severity_level}</span>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">👥</span> Available Workers
              </h3>
              
              {workers.length > 0 ? (
                <div className="space-y-4">
                  {workers.map(worker => (
                    <div key={worker._id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-lg mr-3">
                            {worker.name?.charAt(0) || "W"}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{worker.name}</h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="mr-1">📱</span> {worker.phone}
                            </p>
                            <p className="text-sm text-gray-600 flex items-center">
                              <span className="mr-1">✉️</span> {worker.email}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {worker.skills.map((skill, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {worker.status !== "busy" ? (
                          <button
                            onClick={() => assignWorkerToComplaint(worker)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white text-sm rounded-xl hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                          >
                            Assign
                          </button>
                        ) : (
                          <div className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-lg font-medium">
                            Busy
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-xl">
                  <div className="text-4xl mb-2">😔</div>
                  <p className="text-gray-500">No workers available for this department and location.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};