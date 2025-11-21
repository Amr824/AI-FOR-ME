import React from 'react';
import { Download, Maximize2, Sparkles, CopyPlus, Image as ImageIcon } from 'lucide-react';
import { GeneratedImage } from '../types';

interface ResultViewerProps {
  image: GeneratedImage | null;
  isGenerating: boolean;
  onUseAsReference: (image: GeneratedImage) => void;
}

const ResultViewer: React.FC<ResultViewerProps> = ({ image, isGenerating, onUseAsReference }) => {
  if (!image && !isGenerating) {
    return (
      <div className="w-full max-w-3xl mx-auto mt-12 border border-dashed border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-500 min-h-[300px] bg-slate-900/20 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-500/5 blur-3xl rounded-full"></div>
        
        <div className="relative w-20 h-20 bg-slate-900/50 rounded-2xl flex items-center justify-center mb-6 shadow-inner border border-slate-800/50">
          <ImageIcon className="w-8 h-8 opacity-40" />
        </div>
        <h3 className="text-lg font-bold text-slate-400 mb-2">مساحة العمل فارغة</h3>
        <p className="text-sm opacity-60 max-w-xs text-center">أدخل وصفاً للصورة في الأعلى ثم اضغط على زر التوليد لتبدأ الرحلة</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto mt-12 space-y-4 animate-fade-in">
      <div className="relative group rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 min-h-[400px] flex items-center justify-center">
        
        {isGenerating && (
          <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-indigo-200 mb-2">جاري رسم خيالك...</h3>
            <p className="text-sm text-slate-400">يستخدم Gemini 2.5 Flash أحدث التقنيات لتوليد الصورة</p>
          </div>
        )}

        {image && (
          <>
             <img 
              src={image.url} 
              alt={image.prompt}
              className="w-full h-auto object-contain max-h-[85vh] animate-zoom-in"
            />
            
            {/* Hover Overlay Actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-between p-6">
              <div className="text-white max-w-[60%] hidden sm:block">
                <p className="text-xs font-medium text-indigo-300 mb-1">الوصف المستخدم:</p>
                <p className="text-sm font-medium line-clamp-2 text-slate-200 leading-relaxed">{image.prompt}</p>
              </div>
              
              <div className="flex gap-3 items-center w-full sm:w-auto justify-end">
                 <button 
                  onClick={() => onUseAsReference(image)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 hover:bg-indigo-600/90 backdrop-blur-md border border-slate-700 hover:border-indigo-500/50 rounded-xl text-white text-sm font-bold transition-all shadow-lg"
                  title="استخدم هذه الصورة كمرجع"
                >
                  <CopyPlus className="w-4 h-4" />
                  <span className="hidden sm:inline">استخدام كمرجع</span>
                </button>

                 <a 
                  href={image.url} 
                  download={`khayal-ai-${image.id}.png`}
                  className="p-2.5 bg-white hover:bg-slate-200 text-slate-900 rounded-xl transition-colors shadow-lg"
                  title="تحميل الصورة"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultViewer;