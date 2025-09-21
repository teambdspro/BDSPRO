'use client';

import Hero from '@/components/Hero';
import Features from '@/components/Features';
import PremiumRewards from '@/components/PremiumRewards';
import Community from '@/components/Community';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1A1B26' }}>
      {/* Simple Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-lg border-b" style={{ backgroundColor: 'rgba(26, 27, 38, 0.9)', borderColor: '#2D2E3F' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(90deg, #00AFFF, #8000FF, #FF00FF)' }}>
                <span className="text-white font-bold">B</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent" style={{ background: 'linear-gradient(90deg, #00AFFF, #8000FF, #FF00FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                BDS PRO
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="#features" className="text-gray-300 hover:text-[#00AFFF] font-medium transition-colors">Features</a>
              <a href="#contact" className="text-gray-300 hover:text-[#00AFFF] font-medium transition-colors">Contact</a>
              <a href="/referral-links" className="text-gray-300 hover:text-[#00AFFF] font-medium transition-colors">Referral Links</a>
            </div>
          </div>
        </div>
      </header>
      
      <main className="pt-16">
        <Hero />
        <Features />
        <PremiumRewards />
        <Community />
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

