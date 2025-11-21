import React from 'react';
import { GeneratedImage } from '../types';
import { Clock } from 'lucide-react';

interface HistoryGalleryProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

const HistoryGallery: React.FC<HistoryGalleryProps> = ({ images, onSelect }) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto mt-16 px-4 mb-12">
      <div className="flex items-center gap-2 mb-6 text-slate-300">
        <Clock className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold">السجل السابق</h2>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.slice(0, 7).map((img) => (
          <div 
            key={img.id}
            onClick={() => onSelect(img)}
            className="group relative aspect-square rounded-xl overflow-hidden border border-slate-800 bg-slate-900 cursor-pointer hover:border-indigo-500/50 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/10"
          >
            <img 
              src={img.url} 
              alt={img.prompt} 
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
              <p className="text-[10px] text-slate-200 line-clamp-2">{img.prompt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryGallery;