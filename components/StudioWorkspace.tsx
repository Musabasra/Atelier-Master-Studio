import React from 'react';

const StudioWorkspace = ({ sketch }) => {
  return (
    <div className="w-full h-full p-8 flex flex-col">
      <h2 className="text-gold font-serif text-2xl mb-4 text-center italic">AI Atelier Polish</h2>
      <div className="flex-1 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
        <p className="text-white/30 text-xs tracking-widest uppercase">Waiting for brush strokes...</p>
      </div>
    </div>
  );
};

export default StudioWorkspace;