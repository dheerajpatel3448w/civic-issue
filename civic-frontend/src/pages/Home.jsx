/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  WrenchScrewdriverIcon, 
  ClockIcon, 
  ChatBubbleLeftRightIcon, 
  MapPinIcon, 
  ArrowPathIcon,
  ShieldCheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
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
        stiffness: 100
      }
    }
  };

  // Features data
  const features = [
    {
      icon: <WrenchScrewdriverIcon className="w-12 h-12" />,
      title: "Quick Issue Resolution",
      description: "Our AI-powered system automatically routes your complaints to the appropriate department for faster resolution."
    },
    {
      icon: <ClockIcon className="w-12 h-12" />,
      title: "24/7 Availability",
      description: "Report issues anytime, anywhere. Our system is always available to serve your civic needs."
    },
    {
      icon: <ChatBubbleLeftRightIcon className="w-12 h-12" />,
      title: "AI Assistant Support",
      description: "Get instant help from our AI assistant for guidance on issue reporting and status updates."
    },
    {
      icon: <MapPinIcon className="w-12 h-12" />,
      title: "Location-Based Services",
      description: "Automatically detect your location for precise issue reporting and tracking."
    },
    {
      icon: <ArrowPathIcon className="w-12 h-12" />,
      title: "Real-Time Updates",
      description: "Receive notifications and updates on your complaint status in real-time."
    },
    {
      icon: <ShieldCheckIcon className="w-12 h-12" />,
      title: "Secure Platform",
      description: "Your data and privacy are protected with our secure, encrypted platform."
    }
  ];

  // Stats data
  const stats = [
    { value: "15,000+", label: "Issues Resolved" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "2.5h", label: "Avg. Response Time" },
    { value: "50+", label: "Cities Served" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-blue-600 to-indigo-700"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              AI-Powered
              <span className="block text-blue-200 mt-2">Civic Issue Resolution</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
              Transforming how communities report and resolve civic issues with artificial intelligence and real-time tracking.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-indigo-700 rounded-lg font-semibold shadow-lg"
              >
                <Link to="/complaint">Report an Issue</Link>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold"
              >
                <Link to="/about">Learn More</Link>
              </motion.button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center p-4"
                >
                  <div className="text-3xl md:text-4xl font-bold text-indigo-700">{stat.value}</div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How AI CivicSolver Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced platform uses artificial intelligence to streamline civic issue reporting and resolution
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="bg-gray-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-indigo-600 mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Simple & Efficient Process</h2>
            <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
              Report, track, and resolve civic issues in just a few easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white p-8 rounded-xl text-center"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-indigo-700">{step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step === 1 && "Report the Issue"}
                  {step === 2 && "AI Analysis & Routing"}
                  {step === 3 && "Resolution & Feedback"}
                </h3>
                <p className="text-gray-600">
                  {step === 1 && "Use our simple form to report any civic issue with details and photos."}
                  {step === 2 && "Our AI system analyzes and routes your complaint to the right department."}
                  {step === 3 && "Track resolution progress and provide feedback once the issue is resolved."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Join thousands of citizens who are using AI CivicSolver to improve their communities
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg"
            >
              <Link to="/complaint">Get Started Now</Link>
            </motion.button>
            
            <p className="mt-6 text-gray-500">No registration required. It's free to use!</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;