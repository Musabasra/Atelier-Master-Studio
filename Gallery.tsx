import React from 'react';

const Gallery = ({ onOpen }) => {
  const projects = [
    { id: 1, title: 'Autumn Collection', imageUrl: 'https://images.unsplash.com/photo-1539109132313-3f99ca33e525?q=80&w=400' },
    { id: 2, title: 'Couture Study', imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=400' }
  ];

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {projects.map((p) => (
        <div 
          key={p.id} 
          onClick={() => onOpen(p)}
          className="bg-charcoal border border-white/10 rounded-lg overflow-hidden cursor-pointer hover:border-gold transition"
        >
          <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover opacity-70 hover:opacity-100 transition" />
          <div className="p-4"><h3 className="text-gold font-serif">{p.title}</h3></div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;