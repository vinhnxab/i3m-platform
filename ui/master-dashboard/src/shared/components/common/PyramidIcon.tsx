interface PyramidIconProps {
  size?: number;
  className?: string;
  animated?: boolean;
  theme?: "auto" | "dark" | "light";
  colorEffect?: "default" | "rainbow" | "colorshift";
}

export function PyramidIcon({ 
  size = 32, 
  className = "", 
  animated = false,
  theme = "auto",
  colorEffect = "default"
}: PyramidIconProps) {
  const themes = {
    auto: {
      outline: "#0a84ff", // Apple blue instead of white
      line1: "#00ffff", // cyan bright
      line2: "#0088cc", // cyan medium  
      line3: "#88ddff"  // cyan light
    },
    dark: {
      outline: "#0a84ff", // Apple blue instead of white
      line1: "#00ffff", // cyan bright
      line2: "#0088cc", // cyan medium
      line3: "#88ddff"  // cyan light
    },
    light: {
      outline: "#007aff", // Apple blue for better contrast
      line1: "#005599", // darker blue-cyan
      line2: "#003366", // darkest blue
      line3: "#0077bb"  // medium blue
    }
  };

  const currentTheme = themes[theme];
  const getAnimationClasses = () => {
    if (!animated) return { outline: '', line1: '', line2: '', line3: '' };
    
    switch (colorEffect) {
      case 'rainbow':
        return {
          outline: 'rainbow-outline',
          line1: 'rainbow-line-1',
          line2: 'rainbow-line-2',
          line3: 'rainbow-line-3'
        };
      case 'colorshift':
        return {
          outline: 'colorshift-outline',
          line1: 'colorshift-line-1',
          line2: 'colorshift-line-2',
          line3: 'colorshift-line-3'
        };
      default:
        return {
          outline: 'animated-outline',
          line1: 'animated-line-1',
          line2: 'animated-line-2',
          line3: 'animated-line-3'
        };
    }
  };

  const animationClasses = getAnimationClasses();
  
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-500 hover:scale-110 hover:rotate-3 ${className}`}
      style={{
        ...(animated && {
          '--line1-color': currentTheme.line1,
          '--line2-color': currentTheme.line2,
          '--line3-color': currentTheme.line3,
        })
      }}
    >
      <defs>
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        {/* Inner glow */}
        <filter id="innerGlow">
          <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g>
        <path
          d="M 20 5 L 5 32 L 35 32 Z"
          fill="none"
          stroke={animated && colorEffect === 'default' ? 'var(--line1-color)' : currentTheme.outline}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={animationClasses.outline}
        />
        <line 
          x1="20" 
          y1="23" 
          x2="20" 
          y2="5" 
          stroke={animated && colorEffect === 'default' ? 'var(--line1-color)' : currentTheme.line1}
          strokeWidth="2" 
          strokeLinecap="round"
          className={animationClasses.line1}
        />
        <line 
          x1="20" 
          y1="23" 
          x2="5" 
          y2="32" 
          stroke={animated && colorEffect === 'default' ? 'var(--line2-color)' : currentTheme.line2}
          strokeWidth="2" 
          strokeLinecap="round"
          className={animationClasses.line2}
        />
        <line 
          x1="20" 
          y1="23" 
          x2="35" 
          y2="32" 
          stroke={animated && colorEffect === 'default' ? 'var(--line3-color)' : currentTheme.line3}
          strokeWidth="2" 
          strokeLinecap="round"
          className={animationClasses.line3}
        />

      </g>
    </svg>
  );
}
