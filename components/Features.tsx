'use client';

import { motion } from 'framer-motion';
import { Zap, Shield, Users, Clock, TrendingUp, Headphones } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Fast Transactions',
      description: 'Lightning-fast transaction processing with sub-second confirmation times.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure Operations',
      description: 'Bank-grade security with multi-layer encryption and cold storage protection.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Dedicated Team',
      description: 'Expert team of crypto professionals committed to your trading success.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to assist you anytime, anywhere.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Comprehensive trading analytics and real-time market insights.',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Headphones,
      title: 'Educational Resources',
      description: 'Extensive library of trading guides, tutorials, and market analysis.',
      color: 'from-red-400 to-pink-500'
    }
  ];

  return (
    <section id="features" className="py-20" style={{ backgroundColor: '#2D2E3F' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Choose <span className="gradient-text" style={{ background: 'linear-gradient(90deg, #00AFFF, #8000FF, #FF00FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BDS PRO</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of crypto trading with our cutting-edge platform 
            designed for both beginners and experienced traders.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border" style={{ backgroundColor: '#1A1B26', borderColor: '#2D2E3F' }}
            >
              <div className="flex items-center mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mr-4`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
