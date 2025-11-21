import React, { useState } from 'react';
import { Lightbulb, Camera, Palette, Box, Sparkles, Moon } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

const CATEGORIES = [
  {
    id: 'realistic',
    label: 'واقعي',
    icon: Camera,
    prompts: [
      "صورة سينمائية لشاطئ وقت الغروب مع أمواج هادئة وانعكاسات ذهبية، دقة عالية 8k",
      "بورتري احترافي لرجل عجوز بملامح حكيمة، إضاءة درامية، تفاصيل دقيقة للوجه",
      "صورة جوية لمدينة نيويورك في المستقبل، سيارات طائرة، أضواء نيون، أجواء ممطرة"
    ]
  },
  {
    id: '3d',
    label: 'ثلاثي الأبعاد',
    icon: Box,
    prompts: [
      "شخصية كرتونية لطيفة لروبوت صغير يحمل زهرة، نمط بيكسار، إضاءة ناعمة، دقة 4k",
      "غرفة معيشة عصرية بتصميم ثلاثي الأبعاد، ألوان باستيل مريحة، أثاث بسيط",
      "جزيرة عائمة في السماء بتصميم بولي منخفض (Low Poly)، شلالات مياه، ألوان زاهية"
    ]
  },
  {
    id: 'fantasy',
    label: 'خيالي',
    icon: Sparkles,
    prompts: [
      "قصر كريستالي عملاق فوق السحاب، تنانين تحلق حوله، أجواء سحرية، رسم رقمي",
      "غابة مسحورة بنباتات مضيئة ومخلوقات غريبة، ألوان بنفسجية وزرقاء، نمط خيالي",
      "محارب أسطوري يرتدي درعاً لامعاً ويحمل سيفاً من الضوء، خلفية معركة ملحمية"
    ]
  },
  {
    id: 'art',
    label: 'فني',
    icon: Palette,
    prompts: [
      "لوحة زيتية لقرية ريفية قديمة، أسلوب فانت جوخ، ضربات فرشاة واضحة، ألوان دافئة",
      "تكوين تجريدي لأشكال هندسية وألوان مائية متداخلة، فن حديث، تفاصيل دقيقة",
      "رسم بقلم الرصاص لقطة تلعب بالكرة، تظليل واقعي، خلفية بيضاء"
    ]
  },
  {
    id: 'islamic',
    label: 'طابع إسلامي',
    icon: Moon,
    prompts: [
      "مسجد قديم بتصميم معماري إسلامي دقيق وقت الفجر، إضاءة ناعمة، جو روحاني",
      "زخارف هندسية إسلامية معقدة باللون الذهبي والأزرق الفيروزي، دقة عالية",
      "خط عربي ثلاثي الأبعاد لكلمة 'سلام' في الصحراء، إضاءة غروب الشمس"
    ]
  }
];

const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt }) => {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);

  const selectedCategory = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className="pt-4 animate-fade-in">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3">
        <Lightbulb className="w-4 h-4 text-yellow-400" />
        <span>أفكار ملهمة (اختر قسماً):</span>
      </div>
      
      {/* Scrollable Categories - Improved styling */}
      <div className="flex gap-2 overflow-x-auto pb-4 -mx-1 px-1 no-scrollbar scroll-smooth" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border shadow-sm
                  ${isActive 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-indigo-500/30 translate-y-[-1px]' 
                    : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-600'}
                `}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {selectedCategory?.prompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(prompt)}
            className="group flex items-start text-right text-xs text-slate-300 bg-black/20 hover:bg-indigo-900/20 border border-slate-800 hover:border-indigo-500/50 p-3 rounded-xl transition-all duration-200 hover:shadow-md"
          >
            <span className="opacity-50 group-hover:opacity-100 group-hover:text-indigo-400 transition-opacity ml-2 mt-0.5">
              <Sparkles className="w-3 h-3" />
            </span>
            <span className="leading-relaxed">{prompt}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PromptSuggestions;