import React from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  direction?: 'fluid' | 'slide' | 'scale' | 'lift';
  duration?: number;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  pageKey, 
  direction = 'fluid',
  duration = 0.45 
}) => {
  // Apple's signature spring configuration for smooth, natural motion
  const springConfig = {
    type: "spring",
    damping: 25,
    stiffness: 200,
    mass: 0.8,
    restDelta: 0.0001
  };

  // Enhanced easing curves that match iPhone's fluidity
  const fluidEasing = [0.25, 0.46, 0.45, 0.94]; // Custom Apple-inspired curve
  const snapEasing = [0.16, 1, 0.3, 1]; // For quick, snappy animations

  const variants = {
    fluid: {
      initial: { 
        opacity: 0, 
        scale: 1.02,
        y: 20,
        filter: "blur(8px)"
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        y: 0,
        filter: "blur(0px)"
      },
      exit: { 
        opacity: 0, 
        scale: 0.98,
        y: -20,
        filter: "blur(8px)"
      }
    },
    slide: {
      initial: { 
        opacity: 0, 
        x: 300,
        scale: 0.95
      },
      animate: { 
        opacity: 1, 
        x: 0,
        scale: 1
      },
      exit: { 
        opacity: 0, 
        x: -300,
        scale: 0.95
      }
    },
    scale: {
      initial: { 
        opacity: 0, 
        scale: 0.8,
        rotateY: 15
      },
      animate: { 
        opacity: 1, 
        scale: 1,
        rotateY: 0
      },
      exit: { 
        opacity: 0, 
        scale: 1.1,
        rotateY: -15
      }
    },
    lift: {
      initial: { 
        opacity: 0, 
        y: 100,
        scale: 0.9,
        rotateX: 10
      },
      animate: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        rotateX: 0
      },
      exit: { 
        opacity: 0, 
        y: -50,
        scale: 1.05,
        rotateX: -5
      }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={variants[direction]}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          ...springConfig,
          duration: duration,
          ease: direction === 'fluid' ? fluidEasing : snapEasing
        }}
        className="w-full h-full"
        style={{
          willChange: "transform, opacity, filter",
          backfaceVisibility: "hidden",
          perspective: 1000
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Interactive element wrapper for enhanced touch interactions
export const InteractiveElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({ children, className = "", onClick, disabled = false }) => {
  const scale = useSpring(1, { damping: 15, stiffness: 300 });
  const opacity = useTransform(scale, [0.95, 1], [0.8, 1]);

  const handleMouseDown = () => {
    if (!disabled) {
      scale.set(0.95);
    }
  };

  const handleMouseUp = () => {
    if (!disabled) {
      scale.set(1);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      scale.set(1);
    }
  };

  return (
    <motion.div
      style={{ scale, opacity }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={disabled ? undefined : onClick}
      className={`cursor-pointer select-none ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 400
      }}
    >
      {children}
    </motion.div>
  );
};
