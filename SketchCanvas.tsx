import React from 'react';

const SketchCanvas = ({ sketch }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white text-charcoal">
      <p className="font-serif italic">Sketching Workspace for: {sketch?.title || "New Design"}</p>
      <div className="border-2 border-dashed border-charcoal/20 w-3/4 h-3/4 mt-4 flex items-center justify-center">
        [Canvas Drawing Area]
      </div>
    </div>
  );
};

export default SketchCanvas;