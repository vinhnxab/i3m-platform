import { useState } from 'react';
import { Languages } from 'lucide-react';
import { useLanguage, type Language } from '@/app/providers/LanguageProvider';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    // Major Languages
    { code: 'en' as Language, name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'vi' as Language, name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh' as Language, name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja' as Language, name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko' as Language, name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'fr' as Language, name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de' as Language, name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'es' as Language, name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    
    // European Languages
    { code: 'ru' as Language, name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'pt' as Language, name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
    { code: 'it' as Language, name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'nl' as Language, name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv' as Language, name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'no' as Language, name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
    { code: 'da' as Language, name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
    { code: 'fi' as Language, name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
    { code: 'pl' as Language, name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    
    // Middle East & Asia
    { code: 'tr' as Language, name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'ar' as Language, name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi' as Language, name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'th' as Language, name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
    { code: 'id' as Language, name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'ms' as Language, name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'tl' as Language, name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageSelect = (lang: typeof languages[0]) => {
    setLanguage(lang.code);
    setIsOpen(false);
    console.log('Language selected:', lang.name, lang.code);
  };

  return (
    <div className="relative" style={{ zIndex: 10001 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/30 backdrop-blur-xl text-white transition-all duration-200 glass-effect-button"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span className="text-base font-medium">{currentLanguage.nativeName}</span>
        <Languages className="w-3 h-3" />
      </button>
      
      {isOpen && (
        <div className="absolute top-12 right-0 bg-white/5 backdrop-blur-xl border border-white/30 rounded-lg shadow-2xl min-w-[200px] max-h-[300px] overflow-y-auto p-2 space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang)}
              className={`w-full flex items-center space-x-2 px-3 py-2.5 text-base transition-colors rounded-lg ${
                lang.code === language 
                  ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="text-base">{lang.flag}</span>
              <span className="font-medium">{lang.nativeName}</span>
              {lang.code === language && (
                <span className="ml-auto text-white font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}