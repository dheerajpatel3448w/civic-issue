import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Camera,
  MapPin,
  Bell,
  Shield,
  Brain,
  Bot,
  BarChart3,

  Globe,
  WifiOff,
  Mic,
  Phone,
  TrendingUp,
  Users,
  Heart,
  
  Calculator,
  AlertTriangle,
  MessageCircle,
  CheckCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

const UpcomingFeatures = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const features = [
    {
      category: 'ai',
      icon: Brain,
      title: 'AI Complaint Categorization',
      description: 'Auto-detect issue category from photo or text using advanced AI',
      status: 'completed',
      color: 'from-purple-500 to-pink-500'
    },
    {
      category: 'ai',
      icon: CheckCircle,
      title: 'AI Verification System',
      description: 'Compare before & after images to auto-verify work completion',
      status: 'development',
      color: 'from-green-500 to-teal-500'
    },
    {
      category: 'ai',
      icon: Zap,
      title: 'AI Escalation',
      description: 'Auto-escalation to real departments (Nagar Palika, PWD, Jal Nigam)',
      status: 'planning',
      color: 'from-orange-500 to-red-500'
    },
    {
      category: 'ai',
      icon: AlertTriangle,
      title: 'AI Priority Escalation',
      description: 'Highlight high-priority issues like sewage near schools',
      status: 'planning',
      color: 'from-red-500 to-pink-500'
    },
    {
      category: 'communication',
      icon: Bot,
      title: 'AI Chatbot Assistant',
      description: 'Complaint flow support via text + voice chat',
      status: 'development',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      category: 'communication',
      icon: Bell,
      title: 'Enhanced Notifications',
      description: 'Email alerts with future WhatsApp/SMS integration',
      status: 'completed',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      category: 'communication',
      icon: Mic,
      title: 'Voice-Based Reporting',
      description: 'Complaint reporting in local languages for rural areas',
      status: 'planning',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      category: 'communication',
      icon: Phone,
      title: 'IVR & SMS Fallback',
      description: 'Missed-call to SMS/IVR for complaint registration',
      status: 'planning',
      color: 'from-green-500 to-emerald-500'
    },
    {
      category: 'analytics',
      icon: MapPin,
      title: 'City Heatmap',
      description: 'Live heatmap of complaint density across the city',
      status: 'development',
      color: 'from-red-500 to-orange-500'
    },
    {
      category: 'analytics',
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Average resolution time per department with monthly trends',
      status: 'development',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      category: 'analytics',
      icon: TrendingUp,
      title: 'Predictive Maintenance',
      description: 'Predicts potential issues before they escalate',
      status: 'planning',
      color: 'from-purple-500 to-blue-500'
    },
    {
      category: 'accessibility',
      icon: Globe,
      title: 'Multilingual Support',
      description: 'Supports Hindi, English, and regional languages',
      status: 'development',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      category: 'accessibility',
      icon: WifiOff,
      title: 'Offline Mode',
      description: 'Save photo + location offline, auto-sync when online',
      status: 'development',
      color: 'from-gray-500 to-blue-500'
    },
    {
      category: 'community',
      icon: Users,
      title: 'Real-time Community',
      description: 'Build communities where people hold each other accountable',
      status: 'planning',
      color: 'from-pink-500 to-rose-500'
    },
    {
      category: 'community',
      icon: Heart,
      title: 'Street Dogs Tracking',
      description: 'Reports non-vaccinated street dogs for municipal/NGO intervention',
      status: 'planning',
      color: 'from-amber-500 to-orange-500'
    },
    {
      category: 'community',
      icon: Camera,
      title: 'DIY Solutions',
      description: 'Suggests temporary citizen-driven fixes while waiting',
      status: 'planning',
      color: 'from-lime-500 to-green-500'
    },
    {
      category: 'community',
      icon: Calculator,
      title: 'Impact Calculator',
      description: 'Shows measurable impact after issue resolution',
      status: 'planning',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      category: 'emergency',
      icon: AlertTriangle,
      title: 'Civic SOS Button',
      description: 'Dedicated SOS for life-threatening civic issues',
      status: 'planning',
      color: 'from-red-600 to-pink-600'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Features', icon: Sparkles, count: features.length },
    { id: 'ai', label: 'AI Features', icon: Brain, count: features.filter(f => f.category === 'ai').length },
    { id: 'communication', label: 'Communication', icon: MessageCircle, count: features.filter(f => f.category === 'communication').length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, count: features.filter(f => f.category === 'analytics').length },
    { id: 'accessibility', label: 'Accessibility', icon: Globe, count: features.filter(f => f.category === 'accessibility').length },
    { id: 'community', label: 'Community', icon: Users, count: features.filter(f => f.category === 'community').length },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle, count: features.filter(f => f.category === 'emergency').length }
  ];

  const filteredFeatures = activeCategory === 'all' 
    ? features 
    : features.filter(feature => feature.category === activeCategory);

  const getStatusColor = (status) => {
    switch(status) {
      case 'development': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planning': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'development': return 'In Development';
      case 'planning': return 'Planning Phase';
      default: return 'Coming Soon';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-6 shadow-2xl"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Coming Soon
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exciting new features that will revolutionize civic issue resolution and community engagement
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white shadow-md border border-white/20'
              }`}
            >
              <category.icon className="w-5 h-5 mr-2" />
              {category.label}
              <span className="ml-2 px-2 py-1 rounded-full text-xs bg-black/10">
                {category.count}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {filteredFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Feature Icon */}
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Status Badge */}
                <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(feature.status)} mb-3`}>
                  {getStatusText(feature.status)}
                </div>

                {/* Feature Title */}
                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* Learn More */}
                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-purple-600 transition-colors duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
        >
          <h2 className="text-3xl font-bold mb-4">Stay Tuned for Updates!</h2>
          <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
            Be the first to know when these exciting features launch. We're working hard to make civic engagement better for everyone.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.2)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Get Notified on Launch
          </motion.button>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg border border-white/20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm font-semibold text-gray-700">
                  {features.filter(f => f.status === 'development').length} in Development
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-sm font-semibold text-gray-700">
                  {features.filter(f => f.status === 'planning').length} in Planning
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpcomingFeatures;