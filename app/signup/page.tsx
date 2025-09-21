"use client";
import SignupForm from '@/components/SignupForm';
import { motion } from 'framer-motion';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Professional Futuristic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Circuit Board Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 98%, #00BFFF 100%),
              linear-gradient(0deg, transparent 98%, #00BFFF 100%),
              radial-gradient(circle at 20% 20%, #00BFFF 3px, transparent 3px),
              radial-gradient(circle at 80% 80%, #00BFFF 3px, transparent 3px),
              radial-gradient(circle at 40% 60%, #FF1493 2px, transparent 2px),
              radial-gradient(circle at 60% 40%, #FF1493 2px, transparent 2px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 120px 120px, 120px 120px, 80px 80px, 80px 80px',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0, 0 0, 0 0'
          }}></div>
        </div>
        
        {/* Central Glowing Logo Area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 bg-blue-500/30 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-400/50 rounded-full"></div>
        </div>
        
        {/* Financial Charts Simulation */}
        <div className="absolute left-4 top-1/4 w-24 h-32 opacity-20">
          <div className="flex items-end space-x-1 h-full">
            <div className="w-2 bg-green-400 h-8"></div>
            <div className="w-2 bg-red-400 h-12"></div>
            <div className="w-2 bg-green-400 h-6"></div>
            <div className="w-2 bg-red-400 h-10"></div>
            <div className="w-2 bg-green-400 h-14"></div>
            <div className="w-2 bg-red-400 h-8"></div>
            <div className="w-2 bg-green-400 h-11"></div>
          </div>
        </div>
        
        <div className="absolute right-4 top-1/3 w-24 h-32 opacity-20">
          <div className="flex items-end space-x-1 h-full">
            <div className="w-2 bg-red-400 h-10"></div>
            <div className="w-2 bg-green-400 h-7"></div>
            <div className="w-2 bg-red-400 h-13"></div>
            <div className="w-2 bg-green-400 h-9"></div>
            <div className="w-2 bg-red-400 h-6"></div>
            <div className="w-2 bg-green-400 h-12"></div>
            <div className="w-2 bg-red-400 h-8"></div>
          </div>
        </div>
        
        {/* Data Stream Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse delay-1500"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-2000"></div>
        </div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">BDS PRO</h1>
          <p className="text-gray-200">Join the future of crypto trading</p>
        </motion.div>
        
        <SignupForm />
      </div>
    </div>
  );
}