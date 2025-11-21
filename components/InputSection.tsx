import React, { useState } from 'react';
import { AspectRatio, GeneratedImage } from '../types';
import { Wand2, Image as ImageIcon, Sparkles, X, Link, Bot } from 'lucide-react';
import PromptSuggestions from './PromptSuggestions';
import { enhancePrompt } from '../services/geminiService';

interface InputSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  referenceImage: GeneratedImage | null;
  onClearReference: () => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
  referenceImage,
  onClearReference,
}) => {
  const [isEnhancing, setIsEnhancing] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (prompt.trim() && !isGenerating) {
        onGenerate();
      }
    }
  };

  const handleSmartEnhance = async () => {
    if (!prompt.trim()) return;
    
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt);
      if (enhanced) {
        setPrompt(enhanced);
      }
    } catch (e) {
      console.error("Failed to enhance prompt", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 bg-slate-900/80 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl ring-1 ring-white/5">
      
      <div className="space-y-3">
        <div className="flex flex-wrap justify-between items-end gap-2">
          <label className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-500/20">
              <Wand2 className="w-4 h-4 text-indigo-400" />
            </div>
            وصف الصورة (Prompt)
          </label>
          
          {/* Smart Assistant Button */}
          <button
            onClick={handleSmartEnhance}
            disabled={isEnhancing || isGenerating || !prompt.trim()}
            className={`
              flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300
              ${!prompt.trim() ? 'opacity-50 cursor-not-allowed' : 'opacity-100'}
              ${isEnhancing 
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'}
            `}
          >
            {isEnhancing ? (
              <>
                <div className="w-3 h-3 border-2 border-indigo-200/30 border-t-indigo-200 rounded-full animate-spin" />
                جاري التفكير...
              </>
            ) : (
              <>
                <Bot className="w-3.5 h-3.5" />
                تحسين الوصف بالذكاء الاصطناعي
              </>
            )}
          </button>
        </div>

        <div className="flex justify-between items-center">
           {referenceImage && (
            <span className="text-xs text-indigo-400 font-bold animate-pulse mb-2 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
               الذاكرة البصرية نشطة
            </span>
          )}
        </div>

        {/* Reference Image Indicator */}
        {referenceImage && (
          <div className="flex items-center gap-4 p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl animate-fade-in mb-2 backdrop-blur-sm">
            <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden border border-indigo-400/40 shadow-md">
              <img 
                src={referenceImage.url} 
                alt="Reference" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <p className="text-sm font-bold text-indigo-100 flex items-center gap-2">
                <Link className="w-3.5 h-3.5" />
                صورة مرجعية
              </p>
              <p className="text-[11px] text-indigo-200/70 mt-0.5">
                سيتم استخدام هذه الصورة كدليل للنمط
              </p>
            </div>
            <button 
              onClick={onClearReference}
              className="p-2 hover:bg-indigo-500/30 rounded-full text-indigo-200 transition-colors"
              title="إزالة الصورة المرجعية"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="relative group">
          <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-0 transition duration-500 group-hover:opacity-50 ${isEnhancing ? 'opacity-40 blur' : ''}`}></div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب هنا... مثال: قطة رائد فضاء تتجول على سطح القمر بأسلوب سينمائي"
            className="relative w-full min-h-[120px] bg-black/40 border border-slate-600 rounded-2xl p-5 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all duration-200 text-lg leading-relaxed shadow-inner"
            disabled={isGenerating || isEnhancing}
          />
          <div className="absolute bottom-4 left-4 text-xs text-slate-400 font-mono bg-black/20 px-2 py-1 rounded-md">
            {prompt.length} حرف
          </div>
        </div>
        
        {/* Suggestion Component */}
        <PromptSuggestions onSelectPrompt={setPrompt} />
      </div>

      <div className="h-px bg-slate-800 my-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20">
               <ImageIcon className="w-4 h-4 text-indigo-400" />
            </div>
            أبعاد الصورة
          </label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(AspectRatio).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setAspectRatio(value)}
                disabled={isGenerating}
                className={`
                  flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all duration-200
                  ${aspectRatio === value 
                    ? 'bg-indigo-600/30 border-indigo-400 text-indigo-100 shadow-[0_0_15px_rgba(99,102,241,0.25)]' 
                    : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800 hover:text-slate-200'}
                `}
                title={key}
              >
                <div className={`border-2 border-current rounded-[2px] mb-1.5 opacity-90 transition-all duration-200
                  ${value === AspectRatio.Square ? 'w-4 h-4' : ''}
                  ${value === AspectRatio.Portrait ? 'w-3 h-4' : ''}
                  ${value === AspectRatio.Landscape ? 'w-4 h-3' : ''}
                  ${value === AspectRatio.Wide ? 'w-6 h-3.5' : ''}
                  ${value === AspectRatio.Tall ? 'w-3.5 h-6' : ''}
                `}></div>
                <span className="text-[10px] font-bold">{value}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim() || isEnhancing}
          className={`
            w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:-translate-y-0.5
            ${isGenerating || !prompt.trim() || isEnhancing
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none' 
              : 'bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/40 active:scale-[0.98]'}
          `}
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              جاري التوليد...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              توليد الصورة الآن
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputSection;