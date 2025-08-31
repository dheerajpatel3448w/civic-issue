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
      });
    } catch (error) {
      console.log(error);
    }
  }, []);

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
          ))
        
        
        setShowWorkerSidebar(false);
        setSelectedComplaint(null);
        alert("Worker assigned successfully!");
      }
     catch (error) {
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
    <div className="min-h-screen bg-gray-100 p-6 relative">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4 border-b border-gray-300">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Complaint Management Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="resolved">Resolved</option>
            </select>
            <select 
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="garbage">Garbage</option>
              <option value="pothole">Pothole</option>
              <option value="water">Water Issue</option>
            </select>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map(complaint => {
            const progress = getProgressStatus(complaint.status);
            const statusClass = complaint.status.toLowerCase();
            
            return (
              <div key={complaint._id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={complaint.media} 
                    alt={complaint.problem_type}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">{complaint.title || "Untitled Complaint"}</h2>
                  <p className="text-sm text-gray-600">{complaint.address}</p>
                </div>
                
                <div className="p-4">
                  <div className="mb-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      statusClass === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      statusClass === 'assigned' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {complaint.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-gray-500 w-28 flex-shrink-0">Description:</span>
                      <span className="text-gray-800">{complaint.description}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-28 flex-shrink-0">Problem Type:</span>
                      <span className="text-gray-800 capitalize">{complaint.problem_type}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-28 flex-shrink-0">Severity:</span>
                      <span className={`font-medium ${
                        complaint.severity_level === 'high' ? 'text-red-600' :
                        complaint.severity_level === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {complaint.severity_level}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-28 flex-shrink-0">Department:</span>
                      <span className="text-gray-800 capitalize">{complaint.department.replace('_', ' ')}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-500 w-28 flex-shrink-0">Assigned To:</span>
                      <span className="text-gray-800">{complaint.assignedWorker || 'Not assigned'}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between relative mb-6">
                      <div className="absolute top-3 left-3 right-3 h-1 bg-gray-200 z-0">
                        <div 
                          className="h-1 bg-green-500 transition-all duration-500"
                          style={{ width: progress.width }}
                        ></div>
                      </div>
                      <div className="flex flex-col items-center z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${progress.reported ? 'bg-green-500' : 'bg-gray-300'}`}>
                          1
                        </div>
                        <span className={`text-xs mt-1 ${progress.reported ? 'text-green-600 font-medium' : 'text-gray-500'}`}>Reported</span>
                      </div>
                      <div className="flex flex-col items-center z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${progress.assigned ? 'bg-green-500' : 'bg-gray-300'}`}>
                          2
                        </div>
                        <span className={`text-xs mt-1 ${progress.assigned ? 'text-green-600 font-medium' : 'text-gray-500'}`}>Assigned</span>
                      </div>
                      <div className="flex flex-col items-center z-10">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs text-white ${progress.resolved ? 'bg-green-500' : 'bg-gray-300'}`}>
                          3
                        </div>
                        <span className={`text-xs mt-1 ${progress.resolved ? 'text-green-600 font-medium' : 'text-gray-500'}`}>Resolved</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {complaint.status === "Pending" && (
                  <div className="p-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleAssign(complaint)}
                      className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center"
                      disabled={loading}
                    >
                      {loading && selectedComplaint?._id === complaint._id ? (
                        <span>Loading...</span>
                      ) : (
                        <span>Assign Worker</span>
                      )}
                    </button>
                  </div>
                )}
                
                <div className="px-4 py-3 bg-gray-50 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{complaint.name}</span>
                  <span className="text-xs text-gray-500">{formatDate(complaint.createdAt)}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No complaints match the selected filters.</p>
          </div>
        )}
      </div>

      {/* Worker Assignment Sidebar */}
      {showWorkerSidebar && (
        <div className="fixed inset-0  bg-opacity-50 flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Assign Worker</h2>
              <button 
                onClick={closeWorkerSidebar}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Complaint Details:</h3>
              <p className="text-sm text-gray-600">{selectedComplaint?.description}</p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Type:</span> {selectedComplaint?.problem_type}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Location:</span> {selectedComplaint?.address}
              </p>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Available Workers:</h3>
              {workers.length > 0 ? (
                <div className="space-y-3">
                  {workers.map(worker => (
                    <div key={worker._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{worker.name}</h4>
                          <p className="text-sm text-gray-600">{worker.phone}</p>
                          <p className="text-sm text-gray-600">{worker.email}</p>
                          <div className="mt-1">
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {worker.skills.join(', ')}
                            </span>
                          </div>
                        </div>
                      {worker.status!=="busy" ?<button
                          onClick={() => assignWorkerToComplaint(worker)}
                          className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600"
                        >
                          Assign
                        </button>:
                       < div>It's busy</div>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No workers available for this department and location.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};