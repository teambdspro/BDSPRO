"use client";
import SignupForm from '@/components/SignupForm';
import { motion } from 'framer-motion';

export default function SignupPage() {
  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJjaXJjdWl0R3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDAwMDAwIiBzdG9wLW9wYWNpdHk9IjAuOSIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDAwMDAiIHN0b3Atb3BhY2l0eT0iMC4xIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0iIzAwMDAwMCIvPgo8ZyBmaWxsPSJ1cmwoI2NpcmN1aXRHcmFkaWVudCkiPgo8cGF0aCBkPSJNMCwwIEw1MCwyMCBMMTAwLDAgTDE1MCwyMCBMMjAwLDAgTDI1MCwyMCBMMzAwLDAgTDM1MCwyMCBMMzAwLDAgTDI1MCwyMCBMMjAwLDAgTDE1MCwyMCBMMTAwLDAgTDUwLDIwIFoiLz4KPHBhdGggZD0iTTAsMTA4MCBMNTAsMTA2MCBMMTAwLDEwODAgTDE1MCwxMDYwIEwyMDAsMTA4MCBMMjUwLDEwNjAgTDMwMCwxMDgwIEwzNTAsMTA2MCBMMzAwLDEwODAgTDI1MCwxMDYwIEwyMDAsMTA4MCBMMTUwLDEwNjAgTDEwMCwxMDgwIEw1MCwxMDYwIFoiLz4KPC9nPgo8Y2lyY2xlIGN4PSI5NjAiIGN5PSI1NDAiIHI9IjEwMCIgZmlsbD0iIzAwN0JGRiIgZmlsdGVyPSJibHVyKDIwcHgpIi8+CjxjaXJjbGUgY3g9Ijk2MCIgY3k9IjU0MCIgcj0iNjAiIGZpbGw9IiMwMDdCRkYiLz4KPHN2ZyB4PSI5MDAiIHk9IjQ4MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiPgo8cGF0aCBkPSJNMzAsNjAgTDUwLDQwIEw3MCw2MCBMNTAsODAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8cGF0aCBkPSJNNDAsNTAgTDYwLTMwIEw4MCw1MCBMNjAsNzAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8L3N2Zz4KPHN2ZyB4PSI5MDAiIHk9IjQ4MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiPgo8cGF0aCBkPSJNMzAsNjAgTDUwLDQwIEw3MCw2MCBMNTAsODAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8cGF0aCBkPSJNNDAsNTAgTDYwLTMwIEw4MCw1MCBMNjAsNzAgWiIgZmlsbD0iIzAwN0JGRiIvPgo8L3N2Zz4KPC9zdmc+')`,
          filter: 'brightness(0.3) contrast(1.2)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2">BDS PRO</h1>
          <p className="text-gray-600">Join the future of crypto trading</p>
        </motion.div>
        
        <SignupForm />
      </div>
    </div>
  );
}


