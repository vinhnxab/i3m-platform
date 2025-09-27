import { I3MLogo } from "./I3MLogo";
import { motion } from "motion/react";

interface LoadingLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  theme?: "auto" | "dark" | "light";
  colorEffect?: "rainbow" | "colorshift";
  showText?: boolean;
}

export function LoadingLogo({ 
  size = "md", 
  className = "",
  theme = "auto",
  colorEffect = "rainbow",
  showText = false
}: LoadingLogoProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      {/* Animated Logo with Pulsing Container */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
      >
        {/* Glowing backdrop */}
        <motion.div
          animate={{
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150"
        />
        
        {/* Main Logo */}
        <I3MLogo 
          size={size} 
          animated={true} 
          theme={theme} 
          colorEffect={colorEffect}
        />
      </motion.div>
      
      {/* Optional Loading Text */}
      {showText && (
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground font-medium">Loading...</p>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full mt-2"
            animate={{
              opacity: [0.3, 1, 0.3],
              scaleX: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      )}
    </div>
  );
}
