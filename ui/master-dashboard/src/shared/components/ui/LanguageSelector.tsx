import { motion } from 'motion/react';
import { Languages, Check } from 'lucide-react';
import { Button } from '@/shared/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/shared/components/ui';
import { useLanguage, type Language } from '@/app/providers/LanguageProvider';

const languages = [
  // Major Languages
  { code: 'en' as Language, name: 'English', flag: '🇺🇸', nativeName: 'English', region: 'North America' },
  { code: 'zh' as Language, name: 'Chinese', flag: '🇨🇳', nativeName: '中文', region: 'East Asia' },
  { code: 'es' as Language, name: 'Spanish', flag: '🇪🇸', nativeName: 'Español', region: 'Europe' },
  { code: 'hi' as Language, name: 'Hindi', flag: '🇮🇳', nativeName: 'हिन्दी', region: 'South Asia' },
  { code: 'ar' as Language, name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية', region: 'Middle East' },
  { code: 'pt' as Language, name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português', region: 'South America' },
  { code: 'bn' as Language, name: 'Bengali', flag: '🇧🇩', nativeName: 'বাংলা', region: 'South Asia' },
  { code: 'ru' as Language, name: 'Russian', flag: '🇷🇺', nativeName: 'Русский', region: 'Eastern Europe' },
  { code: 'ja' as Language, name: 'Japanese', flag: '🇯🇵', nativeName: '日本語', region: 'East Asia' },
  { code: 'pa' as Language, name: 'Punjabi', flag: '🇮🇳', nativeName: 'ਪੰਜਾਬੀ', region: 'South Asia' },
  
  // European Languages
  { code: 'de' as Language, name: 'German', flag: '🇩🇪', nativeName: 'Deutsch', region: 'Europe' },
  { code: 'fr' as Language, name: 'French', flag: '🇫🇷', nativeName: 'Français', region: 'Europe' },
  { code: 'it' as Language, name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano', region: 'Europe' },
  { code: 'pl' as Language, name: 'Polish', flag: '🇵🇱', nativeName: 'Polski', region: 'Europe' },
  { code: 'nl' as Language, name: 'Dutch', flag: '🇳🇱', nativeName: 'Nederlands', region: 'Europe' },
  { code: 'sv' as Language, name: 'Swedish', flag: '🇸🇪', nativeName: 'Svenska', region: 'Nordic' },
  { code: 'no' as Language, name: 'Norwegian', flag: '🇳🇴', nativeName: 'Norsk', region: 'Nordic' },
  { code: 'da' as Language, name: 'Danish', flag: '🇩🇰', nativeName: 'Dansk', region: 'Nordic' },
  { code: 'fi' as Language, name: 'Finnish', flag: '🇫🇮', nativeName: 'Suomi', region: 'Nordic' },
  { code: 'is' as Language, name: 'Icelandic', flag: '🇮🇸', nativeName: 'Íslenska', region: 'Nordic' },
  
  // Eastern European
  { code: 'cs' as Language, name: 'Czech', flag: '🇨🇿', nativeName: 'Čeština', region: 'Central Europe' },
  { code: 'sk' as Language, name: 'Slovak', flag: '🇸🇰', nativeName: 'Slovenčina', region: 'Central Europe' },
  { code: 'hu' as Language, name: 'Hungarian', flag: '🇭🇺', nativeName: 'Magyar', region: 'Central Europe' },
  { code: 'ro' as Language, name: 'Romanian', flag: '🇷🇴', nativeName: 'Română', region: 'Eastern Europe' },
  { code: 'bg' as Language, name: 'Bulgarian', flag: '🇧🇬', nativeName: 'Български', region: 'Eastern Europe' },
  { code: 'hr' as Language, name: 'Croatian', flag: '🇭🇷', nativeName: 'Hrvatski', region: 'Southeast Europe' },
  { code: 'sr' as Language, name: 'Serbian', flag: '🇷🇸', nativeName: 'Српски', region: 'Southeast Europe' },
  { code: 'bs' as Language, name: 'Bosnian', flag: '🇧🇦', nativeName: 'Bosanski', region: 'Southeast Europe' },
  { code: 'sl' as Language, name: 'Slovenian', flag: '🇸🇮', nativeName: 'Slovenščina', region: 'Southeast Europe' },
  { code: 'mk' as Language, name: 'Macedonian', flag: '🇲🇰', nativeName: 'Македонски', region: 'Southeast Europe' },
  { code: 'sq' as Language, name: 'Albanian', flag: '🇦🇱', nativeName: 'Shqip', region: 'Southeast Europe' },
  
  // Baltic & Others
  { code: 'et' as Language, name: 'Estonian', flag: '🇪🇪', nativeName: 'Eesti', region: 'Baltic' },
  { code: 'lv' as Language, name: 'Latvian', flag: '🇱🇻', nativeName: 'Latviešu', region: 'Baltic' },
  { code: 'lt' as Language, name: 'Lithuanian', flag: '🇱🇹', nativeName: 'Lietuvių', region: 'Baltic' },
  { code: 'mt' as Language, name: 'Maltese', flag: '🇲🇹', nativeName: 'Malti', region: 'Mediterranean' },
  { code: 'ga' as Language, name: 'Irish', flag: '🇮🇪', nativeName: 'Gaeilge', region: 'Celtic' },
  { code: 'cy' as Language, name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', nativeName: 'Cymraeg', region: 'Celtic' },
  
  // CIS & Eastern European
  { code: 'uk' as Language, name: 'Ukrainian', flag: '🇺🇦', nativeName: 'Українська', region: 'Eastern Europe' },
  { code: 'be' as Language, name: 'Belarusian', flag: '🇧🇾', nativeName: 'Беларуская', region: 'Eastern Europe' },
  { code: 'kk' as Language, name: 'Kazakh', flag: '🇰🇿', nativeName: 'Қазақша', region: 'Central Asia' },
  { code: 'uz' as Language, name: 'Uzbek', flag: '🇺🇿', nativeName: 'O\'zbekcha', region: 'Central Asia' },
  { code: 'mn' as Language, name: 'Mongolian', flag: '🇲🇳', nativeName: 'Монгол', region: 'Central Asia' },
  
  // Caucasus
  { code: 'ka' as Language, name: 'Georgian', flag: '🇬🇪', nativeName: 'ქართული', region: 'Caucasus' },
  { code: 'hy' as Language, name: 'Armenian', flag: '🇦🇲', nativeName: 'Հայերեն', region: 'Caucasus' },
  { code: 'az' as Language, name: 'Azerbaijani', flag: '🇦🇿', nativeName: 'Azərbaycanca', region: 'Caucasus' },
  
  // Middle East & South Asia
  { code: 'fa' as Language, name: 'Persian', flag: '🇮🇷', nativeName: 'فارسی', region: 'Middle East' },
  { code: 'tr' as Language, name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe', region: 'Middle East' },
  { code: 'he' as Language, name: 'Hebrew', flag: '🇮🇱', nativeName: 'עברית', region: 'Middle East' },
  { code: 'ur' as Language, name: 'Urdu', flag: '🇵🇰', nativeName: 'اردو', region: 'South Asia' },
  { code: 'ta' as Language, name: 'Tamil', flag: '🇮🇳', nativeName: 'தமிழ்', region: 'South Asia' },
  { code: 'te' as Language, name: 'Telugu', flag: '🇮🇳', nativeName: 'తెలుగు', region: 'South Asia' },
  { code: 'ml' as Language, name: 'Malayalam', flag: '🇮🇳', nativeName: 'മലയാളം', region: 'South Asia' },
  { code: 'gu' as Language, name: 'Gujarati', flag: '🇮🇳', nativeName: 'ગુજરાતી', region: 'South Asia' },
  { code: 'ne' as Language, name: 'Nepali', flag: '🇳🇵', nativeName: 'नेपाली', region: 'South Asia' },
  { code: 'si' as Language, name: 'Sinhala', flag: '🇱🇰', nativeName: 'සිංහල', region: 'South Asia' },
  
  // Southeast Asia
  { code: 'th' as Language, name: 'Thai', flag: '🇹🇭', nativeName: 'ไทย', region: 'Southeast Asia' },
  { code: 'vi' as Language, name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt', region: 'Southeast Asia' },
  { code: 'id' as Language, name: 'Indonesian', flag: '🇮🇩', nativeName: 'Bahasa Indonesia', region: 'Southeast Asia' },
  { code: 'ms' as Language, name: 'Malay', flag: '🇲🇾', nativeName: 'Bahasa Melayu', region: 'Southeast Asia' },
  { code: 'tl' as Language, name: 'Filipino', flag: '🇵🇭', nativeName: 'Filipino', region: 'Southeast Asia' },
  { code: 'my' as Language, name: 'Burmese', flag: '🇲🇲', nativeName: 'မြန်မာ', region: 'Southeast Asia' },
  { code: 'km' as Language, name: 'Khmer', flag: '🇰🇭', nativeName: 'ខ្មែរ', region: 'Southeast Asia' },
  { code: 'lo' as Language, name: 'Lao', flag: '🇱🇦', nativeName: 'ລາວ', region: 'Southeast Asia' },
  
  // East Asia
  { code: 'ko' as Language, name: 'Korean', flag: '🇰🇷', nativeName: '한국어', region: 'East Asia' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: Language) => {
    setLanguage(langCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 min-w-8 min-h-8 sm:min-w-9 sm:min-h-9 lg:min-w-10 lg:min-h-10 aspect-square rounded-lg sm:rounded-xl bg-muted/50 hover:bg-muted border-0 transition-all duration-200 group p-0 flex items-center justify-center"
        >
          <motion.div
            key={language}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.2, type: "spring", damping: 20, stiffness: 300 }}
            className="flex items-center justify-center w-full h-full"
          >
            <span className="text-base sm:text-lg group-hover:scale-110 transition-all flex-shrink-0">
              {currentLanguage.flag}
            </span>
          </motion.div>
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="rounded-lg sm:rounded-xl border-0 shadow-lg bg-card/95 backdrop-blur-xl min-w-[200px] sm:min-w-[240px] z-[10000]"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="px-2 sm:px-3 py-1.5 sm:py-2 border-b border-border/50">
            <div className="flex items-center space-x-2">
              <Languages className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">
                Language
              </p>
            </div>
          </div>
          
          <div className="max-h-[320px] overflow-y-auto">
            {/* Group languages by region */}
            {Object.entries(
              languages.reduce((acc, lang) => {
                const region = lang.region || 'Other';
                if (!acc[region]) acc[region] = [];
                acc[region].push(lang);
                return acc;
              }, {} as Record<string, typeof languages>)
            ).map(([region, regionLanguages]) => (
              <div key={region} className="mb-2">
                <div className="px-2 py-1 text-xs text-muted-foreground font-medium border-b border-border/30 mb-1">
                  {region}
                </div>
                {regionLanguages.map((lang) => {
                  const isActive = language === lang.code;
                  
                  return (
                    <DropdownMenuItem 
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={`rounded-md sm:rounded-lg cursor-pointer m-0.5 sm:m-1 text-sm ${
                        isActive ? 'bg-primary/10 text-primary' : ''
                      }`}
                    >
                      <span className="mr-2 sm:mr-3 text-base">
                        {lang.flag}
                      </span>
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">{lang.nativeName}</span>
                        <span className="text-xs text-muted-foreground truncate">{lang.name}</span>
                      </div>
                      {isActive && (
                        <motion.div
                          className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary flex-shrink-0"
                          layoutId="activeLanguage"
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        />
                      )}
                    </DropdownMenuItem>
                  );
                })}
              </div>
            ))}
          </div>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}