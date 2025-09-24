/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon, 
  ArrowPathIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentChartBarIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  SparklesIcon,
  EyeIcon,
  ChartPieIcon,
  CogIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { UserContext } from '../context/user.context';
import { OfficerContext } from '../context/officer.context';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { officer } = useContext(OfficerContext);

  const userType = user ? 'user' : officer ? 'officer' : 'guest';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  // User-specific content
  const getUserSpecificContent = () => {
    if (user) {
      return {
        heroTitle: "Welcome Back!",
        heroSubtitle: `${user.name || 'Valued Citizen'}`,
        description: "Continue making your community better with AI-powered civic solutions.",
        primaryButton: "Report New Issue",
        primaryLink: "/complaint",
        secondaryButton: "View My Complaints", 
        secondaryLink: "/usercomplaint",
        gradient: "from-blue-600 via-purple-600 to-indigo-700",
        features: [
          {
            icon: <RocketLaunchIcon className="w-12 h-12" />,
            title: "Quick Issue Reporting",
            description: "Report civic issues in under 2 minutes with our smart form."
          },
          {
            icon: <EyeIcon className="w-12 h-12" />,
            title: "Track Resolution Status",
            description: "Real-time updates on your complaint progress and ETA."
          },
          {
            icon: <ChartPieIcon className="w-12 h-12" />,
            title: "Personal Dashboard",
            description: "View all your complaints and resolution history in one place."
          }
        ]
      };
    } else if (officer) {
      return {
        heroTitle: "Officer Dashboard",
        heroSubtitle: `Officer ${officer.name || ''}`,
        description: "Efficiently manage and resolve civic issues with AI assistance.",
        primaryButton: "View Complaints",
        primaryLink: "/complaintpage",
        secondaryButton: "Worker Management",
        secondaryLink: "/worker",
        gradient: "from-amber-600 via-orange-600 to-red-600",
        features: [
          {
            icon: <CogIcon className="w-12 h-12" />,
            title: "Smart Complaint Management",
            description: "AI-powered prioritization and assignment of civic issues."
          },
          {
            icon: <UsersIcon className="w-12 h-12" />,
            title: "Team Coordination",
            description: "Efficiently manage field workers and task assignments."
          },
          {
            icon: <DocumentTextIcon className="w-12 h-12" />,
            title: "Analytics & Reports",
            description: "Detailed insights and performance metrics for your department."
          }
        ]
      };
    } else {
      return {
        heroTitle: "AI-Powered Civic Solutions",
        heroSubtitle: "Smart Community Platform",
        description: "Transforming how communities report and resolve civic issues with artificial intelligence.",
        primaryButton: "Report an Issue",
        primaryLink: "/complaint",
        secondaryButton: "Learn More",
        secondaryLink: "/about",
        gradient: "from-teal-600 via-cyan-600 to-blue-700",
        features: [
          {
            icon: <WrenchScrewdriverIcon className="w-12 h-12" />,
            title: "Quick Issue Resolution",
            description: "AI-powered routing to appropriate departments for faster resolution."
          },
          {
            icon: <ClockIcon className="w-12 h-12" />,
            title: "24/7 Availability",
            description: "Report issues anytime, anywhere with our always-available platform."
          },
          {
            icon: <ChatBubbleLeftRightIcon className="w-12 h-12" />,
            title: "AI Assistant Support",
            description: "Instant help from our AI assistant for guidance and updates."
          }
        ]
      };
    }
  };

  const content = getUserSpecificContent();

  // Stats data with user-specific numbers
  const stats = user ? [
    { value: "15", label: "Your Reports", icon: <DocumentTextIcon className="w-8 h-8" /> },
    { value: "12", label: "Issues Resolved", icon: <CheckBadgeIcon className="w-8 h-8" /> },
    { value: "95%", label: "Satisfaction Rate", icon: <ChartBarIcon className="w-8 h-8" /> },
    { value: "2.5h", label: "Avg. Response Time", icon: <ClockIcon className="w-8 h-8" /> }
  ] : officer ? [
    { value: "248", label: "Active Cases", icon: <DocumentTextIcon className="w-8 h-8" /> },
    { value: "92%", label: "Resolution Rate", icon: <CheckBadgeIcon className="w-8 h-8" /> },
    { value: "15", label: "Team Workers", icon: <UserGroupIcon className="w-8 h-8" /> },
    { value: "4.2★", label: "Performance", icon: <ChartBarIcon className="w-8 h-8" /> }
  ] : [
    { value: "10,000+", label: "Issues Resolved", icon: <CheckBadgeIcon className="w-8 h-8" /> },
    { value: "95%", label: "Satisfaction Rate", icon: <ChartBarIcon className="w-8 h-8" /> },
    { value: "2.5h", label: "Avg. Response Time", icon: <ClockIcon className="w-8 h-8" /> },
    { value: "50+", label: "Cities Served", icon: <MapPinIcon className="w-8 h-8" /> }
  ];

  // How it works steps based on user type
  const getSteps = () => {
    if (user) {
      return [
        {
          number: 1,
          title: "Report Issue",
          description: "Use our simple form with photo upload and location detection.",
          icon: <DocumentTextIcon className="w-8 h-8" />
        },
        {
          number: 2,
          title: "Track Progress",
          description: "Real-time updates and estimated resolution time from our AI.",
          icon: <ArrowPathIcon className="w-8 h-8" />
        },
        {
          number: 3,
          title: "Get Resolved",
          description: "Receive confirmation when your civic issue is successfully resolved.",
          icon: <CheckBadgeIcon className="w-8 h-8" />
        }
      ];
    } else if (officer) {
      return [
        {
          number: 1,
          title: "Review Complaints",
          description: "AI-prioritized list of civic issues requiring your attention.",
          icon: <EyeIcon className="w-8 h-8" />
        },
        {
          number: 2,
          title: "Assign Tasks",
          description: "Efficiently assign issues to field workers with smart scheduling.",
          icon: <UsersIcon className="w-8 h-8" />
        },
        {
          number: 3,
          title: "Monitor Progress",
          description: "Track resolution progress and generate performance reports.",
          icon: <ChartBarIcon className="w-8 h-8" />
        }
      ];
    } else {
      return [
        {
          number: 1,
          title: "Report the Issue",
          description: "Use our simple form to report any civic issue with details and photos.",
          icon: <DocumentTextIcon className="w-8 h-8" />
        },
        {
          number: 2,
          title: "AI Analysis & Routing",
          description: "Our AI system analyzes and routes your complaint to the right department.",
          icon: <CogIcon className="w-8 h-8" />
        },
        {
          number: 3,
          title: "Resolution & Feedback",
          description: "Track resolution progress and provide feedback once resolved.",
          icon: <CheckBadgeIcon className="w-8 h-8" />
        }
      ];
    }
  };

  const steps = getSteps();

  // Additional features for all users
  const additionalFeatures = [
    {
      icon: <MapPinIcon className="w-10 h-10" />,
      title: "Location-Based Services",
      description: "Automatic location detection for precise issue reporting and tracking."
    },
    {
      icon: <ShieldCheckIcon className="w-10 h-10" />,
      title: "Secure Platform",
      description: "Military-grade encryption to protect your data and privacy."
    },
    {
      icon: <SparklesIcon className="w-10 h-10" />,
      title: "AI-Powered Analytics",
      description: "Smart insights and predictive analysis for better civic management."
    }
  ];

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Hero Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Animated Background */}
        <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${content.gradient} transform skew-y-3 origin-top-left`}></div>
        <div className="absolute inset-0 bg-black/10 mix-blend-multiply"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring" }}
            className="text-center"
          >
            {/* Welcome Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full mb-8 border border-white/30"
            >
              <SparklesIcon className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-semibold text-sm">
                {user ? 'Citizen Portal' : officer ? 'Officer Dashboard' : 'Community Platform'}
              </span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              {content.heroTitle}
              <motion.span 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="block text-3xl md:text-4xl text-white/90 mt-4 font-light"
              >
                {content.heroSubtitle}
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-white/90 max-w-3xl mx-auto mb-12 leading-relaxed"
            >
              {content.description}
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col sm:flex-row justify-center gap-6 mb-16"
            >
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleButtonClick(content.primaryLink)}
                className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group"
              >
                {content.primaryButton}
                <RocketLaunchIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  backgroundColor: "rgba(255,255,255,0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleButtonClick(content.secondaryLink)}
                className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
              >
                {content.secondaryButton}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Enhanced Stats Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-white mb-3 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-white/80 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* User-Specific Features Section */}
      <section className="py-24 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              {user ? 'Your Civic Tools' : officer ? 'Officer Management Features' : 'Why Choose CivicSolver?'}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {user ? 'Everything you need to effectively report and track civic issues in your community.' 
               : officer ? 'Powerful tools to efficiently manage civic issues and coordinate your team.'
               : 'Experience the future of civic issue resolution with our AI-powered platform.'}
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {content.features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  y: -15,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                className="group relative bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${content.gradient} rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className={`text-${userType === 'user' ? 'blue' : officer ? 'amber' : 'teal'}-600 mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                {/* Hover Effect Line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${content.gradient} group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              {user ? 'How It Works for You' : officer ? 'Your Workflow' : 'Simple 3-Step Process'}
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto leading-relaxed">
              {user ? 'From reporting to resolution - see how easy it is to make a difference' 
               : officer ? 'Streamlined process for efficient civic issue management'
               : 'Get started in minutes and see real results in your community'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-24 left-1/4 right-1/4 h-1 bg-white/20 rounded-full"></div>
            
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative bg-white/10 backdrop-blur-lg p-8 rounded-3xl text-center border border-white/20 hover:bg-white/15 transition-all duration-300 group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {step.number}
                  </span>
                </div>

                <div className="text-white mb-6 mt-4 flex justify-center">
                  {step.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-purple-200 leading-relaxed">{step.description}</p>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Advanced Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by cutting-edge technology for the best civic experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="text-center p-6 group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/10 to-transparent"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-white mb-6">
              {user ? 'Ready to Report Another Issue?' 
               : officer ? 'Start Managing Complaints?'
               : 'Ready to Transform Your Community?'}
            </h2>
            <p className="text-xl text-blue-200 max-w-3xl mx-auto mb-10 leading-relaxed">
              {user ? 'Join thousands of citizens making their communities better every day.'
               : officer ? 'Efficiently manage civic issues with our AI-powered platform.'
               : 'Experience the future of civic issue resolution today.'}
            </p>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(255,255,255,0.2)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleButtonClick(content.primaryLink)}
              className="px-12 py-6 bg-white text-gray-900 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 inline-flex items-center group"
            >
              {content.primaryButton}
              <RocketLaunchIcon className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
            </motion.button>
            
            <p className="mt-8 text-blue-300 text-lg">
              {user ? 'Your previous issues: 12 resolved • 3 in progress' 
               : officer ? 'Active cases: 248 • Team performance: 92%'
               : 'No registration required • Completely free to use'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Custom CSS for enhanced shadows */}
      <style jsx>{`
        .shadow-2xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
        .backdrop-blur-lg {
          backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default HomePage;