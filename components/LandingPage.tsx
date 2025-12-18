
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Background with an elegant overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-110"
        style={{ backgroundImage: 'url(https://picsum.photos/seed/atelier-bg/1920/1080)' }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h2 className="text-[#D4AF37] tracking-[0.3em] uppercase text-sm mb-6 font-semibold animate-pulse">
          Excellence in Illustration
        </h2>
        <h1 className="font-serif text-6xl md:text-8xl mb-8 leading-tight">
          Where <span className="italic">Sketch</span> Meets <span className="text-[#D4AF37]">Intelligence</span>.
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          The ultimate digital atelier for the modern couturier. Synchronize your mobile inspirations and polish them with master-grade AI precision.
        </p>

        <button 
          onClick={() => navigate('/archive')}
          className="group relative inline-flex items-center gap-4 bg-[#800020] hover:bg-[#a00028] text-white px-10 py-5 rounded-none transition-all duration-300 transform hover:-translate-y-1 gold-glow overflow-hidden"
        >
          <span className="relative z-10 font-medium tracking-widest text-sm uppercase">Enter Studio</span>
          <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          <div className="absolute inset-0 w-full h-full bg-[#D4AF37] translate-y-full group-hover:translate-y-[95%] transition-transform duration-300 opacity-20"></div>
        </button>
      </div>

      {/* Footer Decoration */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-gray-500 text-[10px] tracking-[0.5em] uppercase">
        Atelier Master Studio • Est. 2024
      </div>
    </div>
  );
};

export default LandingPage;
