import React from 'react';
import { PATTERN_OPACITY, COLORS } from '../constants';

export const GridPattern: React.FC = () => {
  return (
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: `
          linear-gradient(${COLORS.BLUE.LIGHT} 1px, transparent 1px),
          linear-gradient(90deg, ${COLORS.BLUE.LIGHT} 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px",
        opacity: PATTERN_OPACITY.GRID
      }}
    />
  );
};

export default GridPattern;
