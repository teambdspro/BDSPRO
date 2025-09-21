"use client";
import SignupForm from '@/components/SignupForm';
import { motion } from 'framer-motion';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {/* Circuit Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 98%, #00BFFF 100%),
              linear-gradient(0deg, transparent 98%, #00BFFF 100%),
              radial-gradient(circle at 25% 25%, #00BFFF 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, #00BFFF 2px, transparent 2px)
            `,
            backgroundSize: '50px 50px, 50px 50px, 100px 100px, 100px 100px',
            backgroundPosition: '0 0, 0 0, 0 0, 0 0'
          }}></div>
        </div>
        
        {/* Glowing Elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        {/* Data Stream Lines */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-1000"></div>
          <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse delay-2000"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse delay-3000"></div>
        </div>
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