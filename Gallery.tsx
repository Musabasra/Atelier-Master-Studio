import React from 'react';

const Gallery = ({ onOpen }) => {
 const projects = [
  { 
    id: 1, 
    title: 'Avant-Garde Sculpture', 
    sketchUrl: 'https://postimg.cc/w125n383', 
    renderedUrl: 'https://postimg.cc/RNQwnq0H' 
  },
  { 
    id: 2, 
    title: 'Editorial Silhouette', 
    sketchUrl: 'https://postimg.cc/bD711tbF', 
    renderedUrl: 'https://postimg.cc/ZBddY5gR'
  }
];

  return (
    <div className="max-w-7xl mx-auto p-12">
      <div className="mb-12 border-b border-gold/20 pb-6">
        <h2 className="text-[#D4AF37] font-serif text-4xl italic tracking-widest">PRIVATE COLLECTION</h2>
        <p className="text-white/40 text-xs mt-2 tracking-[0.2em] uppercase">Select a manuscript to enter the studio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((p) => (
          <div 
            key={p.id} 
            onClick={() => onOpen(p)}
            className="group relative bg-[#121212] border border-white/5 rounded-2xl overflow-hidden cursor-pointer hover:border-[#D4AF37]/50 transition-all duration-500 shadow-2xl"
          >
            {/* Image Container */}
            <div className="relative h-80 w-full overflow-hidden">
              <img 
  src={p.sketchUrl} 
  alt={p.title} 
  key={p.sketchUrl} // Adding a key forces the browser to look for the image again
  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
/>
              
              {/* Floating Badge */}
              <div className="absolute top-4 right-4 bg-[#800020] text-white text-[10px] tracking-widest px-3 py-1 rounded-full border border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity">
                OPEN PROJECT
              </div>
            </div>

            {/* Title Section */}
            <div className="p-6 bg-[#1a1a1a]">
              <h3 className="text-[#D4AF37] font-serif text-xl tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                {p.title}
              </h3>
              <div className="w-12 h-[1px] bg-[#800020] mt-3 group-hover:w-full transition-all duration-500" />
            </div>
          </div>
        ))}

        {/* Placeholder for "New Project" */}
        <div className="border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-white/20 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]/50 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-2xl">+</div>
          <span className="text-[10px] tracking-[0.3em] uppercase">New Manuscript</span>
        </div>
      </div>
    </div>
  );
};

export default Gallery;