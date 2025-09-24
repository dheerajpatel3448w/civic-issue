/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon,
  DocumentTextIcon,
  UserIcon,
  InformationCircleIcon,
  XMarkIcon,
  Bars3Icon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  BuildingOfficeIcon,
  IdentificationIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { UserContext } from '../context/user.context';
import { OfficerContext } from '../context/officer.context';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { officer, setofficer } = useContext(OfficerContext);

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

  const handleLogout = () => {
    if (user) setUser(null);
    if (officer) setofficer(null);
    navigate('/');
    setIsOpen(false);
  };

  const getUserType = () => {
    if (user) return 'user';
    if (officer) return 'officer';
    return 'guest';
  };

  const userType = getUserType();

  // Improved color schemes with better contrast
  const colorSchemes = {
    user: {
      // Darker blue for better contrast
      gradient: 'from-blue-600 via-purple-600 to-indigo-700',
      scrolledBg: 'bg-white/95 backdrop-blur-xl',
      activeColor: 'text-blue-700',
      activeBg: 'bg-blue-100',
      buttonGradient: 'from-blue-600 to-purple-600',
      hoverText: 'hover:text-blue-700',
      hoverBg: 'hover:bg-blue-100',
      badge: 'bg-blue-500',
      portalName: 'Citizen Portal',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800', // Darker for better contrast
      lightText: 'text-blue-200',
      iconColor: 'text-blue-600',
      mobileGradient: 'from-blue-600 to-purple-700',
      mobileText: 'text-white' // Always white on mobile for contrast
    },
    officer: {
      // Darker orange/amber for better contrast
      gradient: 'from-amber-600 via-orange-600 to-red-600',
      scrolledBg: 'bg-white/95 backdrop-blur-xl',
      activeColor: 'text-amber-700',
      activeBg: 'bg-amber-100',
      buttonGradient: 'from-amber-600 to-orange-600',
      hoverText: 'hover:text-amber-700',
      hoverBg: 'hover:bg-amber-100',
      badge: 'bg-amber-500',
      portalName: 'Officer Portal',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-800', // Much darker for contrast
      lightText: 'text-amber-200',
      iconColor: 'text-amber-600',
      mobileGradient: 'from-amber-600 to-orange-700',
      mobileText: 'text-white'
    },
    guest: {
      // Darker teal for better contrast
      gradient: 'from-teal-600 via-cyan-600 to-blue-700',
      scrolledBg: 'bg-white/95 backdrop-blur-xl',
      activeColor: 'text-teal-700',
      activeBg: 'bg-teal-100',
      buttonGradient: 'from-teal-600 to-cyan-600',
      hoverText: 'hover:text-teal-700',
      hoverBg: 'hover:bg-teal-100',
      badge: 'bg-teal-500',
      portalName: 'Community Platform',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-800',
      lightText: 'text-teal-200',
      iconColor: 'text-teal-600',
      mobileGradient: 'from-teal-600 to-cyan-700',
      mobileText: 'text-white'
    }
  };

  const colors = colorSchemes[userType];

  const navItems = {
    user: [
      { name: 'Home', path: '/', icon: HomeIcon },
      { name: 'File Complaint', path: '/complaint', icon: DocumentTextIcon },
      { name: 'My Complaints', path: '/usercomplaint', icon: UserIcon },
      { name: 'Upcoming Features', path: '/upcoming', icon: StarIcon },

    ],
    officer: [
      { name: 'Dashboard', path: '/', icon: HomeIcon },
      { name: 'Complaints', path: '/complaintpage', icon: DocumentTextIcon },
      { name: 'Workers', path: '/worker', icon: UserIcon },
      
      { name: 'Upcoming Features', path: '/upcoming', icon: StarIcon },
    ],
    guest: [
      { name: 'Home', path: '/', icon: HomeIcon },
      { name: 'About', path: '/about', icon: InformationCircleIcon },
     
      { name: 'UserLogin', path: '/login', icon: UserCircleIcon },
      { name: 'OfficerLogin', path: '/officerlogin', icon: UserCircleIcon },
      { name: 'Register', path: '/register', icon: ShieldCheckIcon },
       { name: 'OfficerRegister', path: '/officer', icon: ShieldCheckIcon },

    ]
  };

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Icons with better visibility
  const getLogoIcon = () => {
    if (userType === 'user') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    } else if (userType === 'officer') {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-2.5a2 2 0 00-1.6.8L12 12.5 8.1 6.8A2 2 0 006.5 6H4a2 2 0 00-2 2v10a2 2 0 002 2h15z" />
        </svg>
      );
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? `${colors.scrolledBg} shadow-soft border-b ${colors.borderColor}` 
          : `bg-gradient-to-r ${colors.gradient} shadow-gentle`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo with Larger Font */}
          <motion.div 
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 flex items-center mr-[50px]"
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <motion.div 
                  whileHover={{ rotate: 5 }}
                  className={`w-16 h-16 rounded-2xl ${
                    scrolled 
                      ? 'bg-white shadow-soft border border-white/80' 
                      : 'bg-white/20 backdrop-blur-sm border border-white/30'
                  } flex items-center justify-center transition-all duration-300 group-hover:shadow-gentle`}
                >
                  {getLogoIcon()}
                </motion.div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className={`absolute -top-1 -right-1 w-4 h-4 ${colors.badge} rounded-full border-2 border-white shadow-sm`}
                ></motion.div>
              </div>
              <div className="flex flex-col">
                <motion.span 
                  className={`text-3xl font-bold ${
                    scrolled ? colors.textColor : 'text-white'
                  } tracking-tight`} // Increased to text-3xl
                  whileHover={{ x: 2 }}
                >
                  CivicSolver
                </motion.span>
                <span className={`text-sm font-medium ${
                  scrolled ? `${colors.textColor}/80` : colors.lightText
                } tracking-wide mt-1`}> {/* Increased to text-sm */}
                  {colors.portalName}
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation - Larger Font Size */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* User/Officer Badge with Larger Text */}
            {(user || officer) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center space-x-3 ${
                  scrolled 
                    ? 'bg-white/90 shadow-soft border border-white/80' 
                    : 'bg-white/20 backdrop-blur-sm border border-white/30'
                } rounded-2xl px-5 py-3 transition-all duration-300`} // Increased padding
              >
                <div className={`p-2 rounded-full ${
                  scrolled ? `${colors.activeBg}` : 'bg-white/30'
                }`}>
                  {userType === 'user' ? (
                    <UserCircleIcon className={`w-6 h-6 ${scrolled ? colors.iconColor : 'text-white'}`} />
                  ) : (
                    <IdentificationIcon className={`w-6 h-6 ${scrolled ? colors.iconColor : 'text-white'}`} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className={`text-base font-bold ${
                    scrolled ? colors.textColor : 'text-white'
                  }`}> {/* Increased to text-base */}
                    {user ? user.name : officer ? officer.name : ''}
                  </span>
                  <span className={`text-xs ${
                    scrolled ? `${colors.textColor}/70` : 'text-white/80'
                  } mt-1`}>
                    {userType === 'user' ? 'Verified Citizen' : 'Municipal Officer'}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Navigation Items with Larger Font */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center space-x-3" // Increased space
            >
              {navItems[userType].map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.name}
                    variants={itemVariants}
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                    custom={index}
                  >
                    <Link
                      to={item.path}
                      className={`relative flex items-center px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 group ${
                        isActive
                          ? scrolled
                            ? `text-white bg-gradient-to-r ${colors.buttonGradient} shadow-gentle`
                            : 'text-white bg-white/30 shadow-gentle backdrop-blur-sm'
                          : scrolled
                          ? `text-gray-700 ${colors.hoverText} ${colors.hoverBg} hover:shadow-soft`
                          : `text-white hover:text-white hover:bg-white/20 hover:backdrop-blur-sm`
                      }`} // Increased to text-base and font-semibold
                    >
                      <item.icon className={`w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-110 ${
                        isActive ? 'animate-pulse' : ''
                      }`} />
                      {item.name}
                      
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute inset-0 rounded-xl bg-white/20"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}

              {/* Logout Button with Larger Font */}
              {(user || officer) && (
                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center px-5 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                    scrolled
                      ? 'text-rose-600 bg-rose-50/80 hover:bg-rose-100/80 hover:shadow-soft'
                      : 'text-rose-100 bg-rose-500/30 hover:bg-rose-500/40 hover:backdrop-blur-sm'
                  }`} // Increased to text-base
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  Logout
                </motion.button>
              )}
            </motion.div>
          </div>

          {/* Mobile menu button - Larger */}
          <div className="lg:hidden flex items-center space-x-4"> {/* Increased space */}
            {(user || officer) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`hidden sm:block text-base font-bold px-4 py-2 rounded-full ${
                  scrolled ? `${colors.activeBg} ${colors.textColor}` : 'bg-white/20 text-white'
                } backdrop-blur-sm`} // Increased to text-base
              >
                {user ? user.name.split(' ')[0] : officer ? `Officer` : ''}
              </motion.div>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-4 rounded-2xl backdrop-blur-sm transition-all duration-300 ${
                scrolled 
                  ? 'bg-white/90 shadow-soft text-gray-700 hover:bg-white' 
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`} // Increased padding to p-4
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" /> 
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Menu with Larger Font */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-lg lg:hidden z-40"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className={`fixed top-0 right-0 h-full w-80 z-50 lg:hidden bg-white shadow-2xl border-l ${colors.borderColor}`}
            >
              {/* Mobile Header with Better Contrast */}
              <div className={`h-28 px-6 flex items-center justify-between bg-gradient-to-r ${colors.mobileGradient}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                    {getLogoIcon()}
                  </div>
                  <div className="text-white">
                    <div className="font-bold">CivicSolver</div> {/* Increased to text-2xl */}
                    <div className="text-sm opacity-90 mt-1">{colors.portalName}</div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-xl text-white hover:bg-white/20 transition-all duration-200"
                >
                  <XMarkIcon className="h-7 w-7" /> {/* Increased icon size */}
                </motion.button>
              </div>

              {/* User Info Section with Larger Text */}
              {(user || officer) && (
                <div className={`px-6 py-5 border-b ${colors.borderColor} bg-gray-50`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${colors.activeBg}`}>
                      {userType === 'user' ? (
                        <UserCircleIcon className={`w-7 h-7 ${colors.iconColor}`} />
                      ) : (
                        <IdentificationIcon className={`w-7 h-7 ${colors.iconColor}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className={`font-bold text-lg ${colors.textColor}`}> {/* Increased to text-lg */}
                        {user ? user.name : officer ? `Officer ${officer.name}` : ''}
                      </div>
                      <div className={`text-base ${colors.textColor}/70 mt-1`}> {/* Increased to text-base */}
                        {userType === 'user' ? 'Citizen Account' : 'Municipal Officer'}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${colors.badge} animate-pulse`}></div>
                  </div>
                </div>
              )}

              {/* Mobile Menu Items with Larger Font */}
              <div className="px-5 py-6 h-full flex flex-col">
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex-1 space-y-4" 
                >
                  {navItems[userType].map((item, index) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <motion.div
                        key={item.name}
                        variants={itemVariants}
                        whileHover={{ x: 5 }}
                        custom={index}
                      >
                        <Link
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center px-5 py-4 rounded-xl text-lg font-semibold transition-all duration-300 group ${
                            isActive
                              ? `text-white bg-gradient-to-r ${colors.buttonGradient} shadow-gentle`
                              : `text-gray-800 hover:${colors.hoverBg} hover:${colors.hoverText} hover:shadow-soft`
                          }`} // Increased to text-lg
                        >
                          <item.icon className={`w-6 h-6 mr-4 transition-transform duration-300 group-hover:scale-110 ${
                            isActive ? 'animate-pulse' : ''
                          }`} />
                          {item.name}
                          {isActive && (
                            <motion.div
                              layoutId="mobileActiveIndicator"
                              className="ml-auto w-3 h-3 bg-white rounded-full animate-pulse"
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>

                {/* Mobile Logout Button with Larger Font */}
                {(user || officer) && (
                  <motion.button
                    variants={itemVariants}
                    onClick={handleLogout}
                    className="flex items-center justify-center w-full px-5 py-4 mt-6 rounded-xl text-lg font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 transition-all duration-300 shadow-soft"
                  > {/* Increased to text-lg */}
                    <ArrowRightOnRectangleIcon className="w-6 h-6 mr-3" />
                    Sign Out
                  </motion.button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Custom CSS for soft shadows */}
      <style jsx>{`
        .shadow-soft {
          box-shadow: 0 4px 25px -2px rgba(0, 0, 0, 0.1);
        }
        .shadow-gentle {
          box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
        }
      `}</style>
    </motion.nav>
  );
};

export default Navbar;