/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  InformationCircleIcon,
  XMarkIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { UserContext } from '../context/user.context';
import { OfficerContext } from '../context/officer.context';
import Complaint from '../../../civic-backend/models/complaint.model';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const{user,setUser} = useContext(UserContext);
  const{officer,setofficer}=useContext(OfficerContext);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
let navItems ;
if(user!=null){


   navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Complaints', path: '/complaint', icon: DocumentTextIcon },
    {name:'Complaintpage',path:'/usercomplaint',icon:DocumentTextIcon}
    
    
  ];
}else if(officer!=null){
    
   navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Complaintpage', path: '/complaintpage', icon: DocumentTextIcon },
    { name: 'worker', path: '/worker', icon: ChatBubbleLeftRightIcon },
  ];
}else{
      navItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    {name:'Login',path:'/login',icon:ChatBubbleLeftRightIcon },
    {name:'Register',path:'/register',icon:ChatBubbleLeftRightIcon}
  ];
}

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md shadow-lg' 
          : 'bg-gradient-to-r from-blue-600 to-indigo-700'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="flex-shrink-0 flex items-center"
          >
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <span className={`text-xl font-bold ${scrolled ? 'text-indigo-600' : 'text-white'}`}>
                AI CivicSolver
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.name}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? scrolled
                            ? 'text-indigo-600 bg-indigo-50'
                            : 'text-white bg-white/20'
                          : scrolled
                          ? 'text-gray-600 hover:text-indigo-600'
                          : 'text-blue-100 hover:text-white'
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-1" />
                      {item.name}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                scrolled ? 'text-gray-600 hover:text-indigo-600' : 'text-blue-100 hover:text-white'
              } focus:outline-none`}
            >
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 md:hidden"
            >
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <span className="text-xl font-bold text-indigo-600">AI CivicSolver</span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="px-4 py-6">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.name}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-indigo-600 bg-indigo-50'
                              : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.name}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;