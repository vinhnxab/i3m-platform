import { PyramidIcon } from "./PyramidIcon";

interface I3MLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
  theme?: "auto" | "dark" | "light";
  colorEffect?: "default" | "rainbow" | "colorshift";
}

export function I3MLogo({ 
  size = "md", 
  className = "",
  animated = false,
  theme = "auto",
  colorEffect = "default"
}: I3MLogoProps) {
  const sizeClasses = {
    sm: {
      icon: 24
    },
    md: {
      icon: 32
    },
    lg: {
      icon: 48
    },
    xl: {
      icon: 64
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return <PyramidIcon size={currentSize.icon} className={className} animated={animated} theme={theme} colorEffect={colorEffect} />;
}
