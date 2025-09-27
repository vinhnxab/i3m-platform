import React from 'react';
import { PATTERN_OPACITY, COLORS } from '../constants';

export const CircuitPattern: React.FC = () => {
  return (
    <div className="absolute top-10 right-10 w-64 h-64" style={{ opacity: PATTERN_OPACITY.CIRCUIT }}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <rect
          x="20"
          y="20"
          width="160"
          height="160"
          fill="none"
          stroke={COLORS.BLUE.PRIMARY}
          strokeWidth="1"
        />
        <circle
          cx="20"
          cy="20"
          r="3"
          fill={COLORS.BLUE.SECONDARY}
        />
        <circle
          cx="180"
          cy="20"
          r="3"
          fill={COLORS.BLUE.SECONDARY}
        />
        <circle
          cx="180"
          cy="180"
          r="3"
          fill={COLORS.BLUE.SECONDARY}
        />
        <circle
          cx="20"
          cy="180"
          r="3"
          fill={COLORS.BLUE.SECONDARY}
        />
        <path
          d="M20 100 L100 100 L100 20"
          fill="none"
          stroke={COLORS.BLUE.PRIMARY}
          strokeWidth="1"
        />
        <path
          d="M180 100 L100 100 L100 180"
          fill="none"
          stroke={COLORS.BLUE.PRIMARY}
          strokeWidth="1"
        />
        <circle
          cx="100"
          cy="100"
          r="2"
          fill={COLORS.CYAN.TERTIARY}
        />
      </svg>
    </div>
  );
};

export default CircuitPattern;
