import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import ResultViewer from './components/ResultViewer';
import HistoryGallery from './components/HistoryGallery';
import { AspectRatio, GeneratedImage } from './types';
import { generateImageFromText } from './services/geminiService';
import { AlertCircle, Trash2 } from 'lucide-react';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.Square);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [referenceImage, setReferenceImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('khayal_history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load history", e);
      // If data is corrupted, clear it
      localStorage.removeItem('khayal_history');
    }
  }, []);

  // Save history whenever it changes with SAFETY CHECK
  useEffect(() => {
    try {
      // CRITICAL FIX: LocalStorage has a 5MB limit. Base64 images are huge.
      // We only keep the last 6 images to prevent QuotaExceededError which crashes the app.
      const MAX_HISTORY_ITEMS = 6;
      const historyToSave = history.slice(0, MAX_HISTORY_ITEMS);
      
      localStorage.setItem('khayal_history', JSON.stringify(historyToSave));
    } catch (e: any) {
      // Handle QuotaExceededError gracefully so the app doesn't crash
      console.warn("Storage quota exceeded, could not save history locally.", e);
      if (e.name === 'QuotaExceededError' || e.code === 22) {
          // Optionally clear old history if full
          // localStorage.removeItem('khayal_history');
      }
    }
  }, [history]);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setError(null);
    setCurrentImage(null);

    try {
      const base64Image = await generateImageFromText(
        prompt, 
        aspectRatio, 
        referenceImage?.url
      );
      
      if (base64Image) {
        const newImage: GeneratedImage = {
          id: Date.now().toString(),
          url: base64Image,
          prompt: prompt,
          aspectRatio: aspectRatio,
          timestamp: Date.now()
        };

        setCurrentImage(newImage);
        // Add new image to start of history, keep only latest 10 in state to save RAM
        setHistory(prev => [newImage, ...prev].slice(0, 10));
      } else {
        setError("لم نتمكن من توليد الصورة. قد يكون المحتوى غير مسموح به أو هناك ضغط على الخادم.");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      let errorMessage = "حدث خطأ غير متوقع أثناء التوليد.";
      
      if (err.message?.includes('SAFETY')) {
        errorMessage = "عذراً، تم حظر الطلب بسبب معايير السلامة. يرجى تعديل الوصف.";
      } else if (err.message?.includes('429') || err.message?.includes('quota')) {
        errorMessage = "تم تجاوز الحد المسموح من الطلبات. يرجى الانتظار قليلاً.";
      } else if (err.message?.includes('503') || err.message?.includes('Overloaded')) {
         errorMessage = "الخادم مشغول حالياً. يرجى المحاولة مرة أخرى.";
      }
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, aspectRatio, referenceImage]);

  const handleSelectFromHistory = (img: GeneratedImage) => {
    setCurrentImage(img);
    setPrompt(img.prompt);
    setAspectRatio(img.aspectRatio);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUseAsReference = (img: GeneratedImage) => {
    setReferenceImage(img);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearHistory = () => {
      setHistory([]);
      localStorage.removeItem('khayal_history');
  };

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-indigo-500/30 overflow-x-hidden text-slate-100 bg-slate-950">
      {/* Modern Background System */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 -z-20" />
      
      {/* Ambient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none -z-10 mix-blend-screen" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      
      <Header />

      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center relative z-0">
        
        <InputSection 
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          referenceImage={referenceImage}
          onClearReference={() => setReferenceImage(null)}
        />

        {error && (
          <div className="w-full max-w-3xl mt-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-200 animate-fade-in backdrop-blur-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <p>{error}</p>
          </div>
        )}

        <ResultViewer 
          image={currentImage} 
          isGenerating={isGenerating}
          onUseAsReference={handleUseAsReference}
        />

        {history.length > 0 && (
            <div className="w-full max-w-7xl mx-auto relative">
                 <div className="absolute right-4 top-16 z-10">
                    <button 
                        onClick={clearHistory}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="w-3 h-3" />
                        مسح السجل
                    </button>
                 </div>
                <HistoryGallery 
                  images={history} 
                  onSelect={handleSelectFromHistory} 
                />
            </div>
        )}
        
      </main>
      
      <footer className="w-full py-8 border-t border-slate-800/50 bg-slate-950 text-center relative z-10">
        <p className="text-slate-500 text-sm font-medium">Built with React, Tailwind & Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;