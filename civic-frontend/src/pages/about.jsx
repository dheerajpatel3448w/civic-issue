/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartHandshake,
  Users,
  Target,
  Award,
  Globe,
  Clock,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  MessageCircle
} from 'lucide-react';

const AboutPage = () => {
  const stats = [
    { number: '10,000+', label: 'Issues Resolved', icon: CheckCircle },
    { number: '50+', label: 'Cities Covered', icon: MapPin },
    { number: '24h', label: 'Average Response Time', icon: Clock },
    { number: '95%', label: 'User Satisfaction', icon: Award }
  ];

  const values = [
    {
      icon: HeartHandshake,
      title: 'Community First',
      description: 'We believe in empowering communities to take charge of their surroundings and work together for better civic infrastructure.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Every complaint, assignment, and resolution is tracked transparently so citizens can see the entire process.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Bringing together citizens, municipal workers, and authorities to create sustainable solutions.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Building systems that not only fix problems but prevent them from recurring through data-driven insights.'
    }
  ];

  const team = [
    {
      name: 'Tech Innovators',
      role: 'Technology Team',
      description: 'Building cutting-edge solutions to make civic engagement seamless and efficient.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Municipal Partners',
      role: 'Government Collaboration',
      description: 'Working with local authorities to ensure quick resolution and policy support.',
      color: 'from-green-500 to-teal-500'
    },
    {
      name: 'Community Champions',
      role: 'Ground Team',
      description: 'Local volunteers and activists who bridge the gap between citizens and authorities.',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl mb-8 shadow-2xl"
            >
              <HeartHandshake className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              About Our Mission
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing civic issue resolution by connecting communities with municipal authorities 
              through technology. Our platform empowers citizens to report issues, track resolutions, and 
              collaborate for cleaner, safer neighborhoods.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          >
            
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg border border-white/20"
              >
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-3`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded with a vision to bridge the gap between citizens and municipal authorities, 
                  our platform emerged from the need for a transparent, efficient system to address 
                  civic issues that affect everyday life.
                </p>
                <p>
                  What started as a simple idea to help neighbors report potholes and garbage issues 
                  has grown into a comprehensive ecosystem that leverages technology to create 
                  sustainable urban solutions.
                </p>
                <p>
                  Today, we're proud to be at the forefront of civic tech innovation, serving 
                  thousands of citizens across multiple cities while continuously evolving to 
                  meet new challenges.
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center"
              >
                Read Our Full Story
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.button>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-6xl mb-4">🏙️</div>
                <h3 className="text-2xl font-bold mb-3">Building Better Cities Together</h3>
                <p className="text-blue-100 leading-relaxed">
                  We believe that technology should serve people first. Our platform is designed to 
                  make civic engagement accessible, transparent, and effective for everyone.
                </p>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-2xl rotate-12 opacity-20"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-400 rounded-2xl -rotate-12 opacity-20"></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do and every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                  <value.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Our Ecosystem
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're powered by a diverse network of stakeholders working together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="text-center group"
              >
                <div className={`relative inline-flex items-center justify-center w-32 h-32 rounded-3xl bg-gradient-to-r ${member.color} mb-6 shadow-2xl group-hover:shadow-3xl transition-all duration-300`}>
                  <Users className="w-12 h-12 text-white" />
                  <div className="absolute inset-0 rounded-3xl bg-white/10 group-hover:bg-white/20 transition-all duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                <div className="text-blue-600 font-semibold mb-3">{member.role}</div>
                <p className="text-gray-600 leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-12 text-white shadow-2xl"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Be part of the change. Together, we can build cleaner, safer, and more sustainable communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Report an Issue
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-2xl font-bold hover:bg-white/10 transition-all duration-300 flex items-center justify-center"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Us
              </motion.button>
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="flex items-center justify-center text-gray-600">
              <Phone className="w-5 h-5 mr-2 text-blue-500" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <Mail className="w-5 h-5 mr-2 text-blue-500" />
              <span>hello@civicresolve.com</span>
            </div>
            <div className="flex items-center justify-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" />
              <span>Across 50+ Cities in India</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;