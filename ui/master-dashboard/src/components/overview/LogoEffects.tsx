import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui";
import { Palette } from "lucide-react";
import { I3MLogo } from "@/shared/components/common/I3MLogo";
import { LoadingLogo } from "@/shared/components/common/LoadingLogo";
import { LogoEffect } from "./types";

interface LogoEffectsProps {
  effects: LogoEffect[];
}

const LogoEffects: React.FC<LogoEffectsProps> = ({ effects }) => {
  const renderLogo = (effect: LogoEffect) => {
    if (effect.effect === 'loading') {
      return (
        <LoadingLogo 
          size={effect.size || "md"} 
          colorEffect="rainbow" 
        />
      );
    }
    
    return (
      <I3MLogo 
        size={effect.size || "lg"} 
        animated={true} 
        colorEffect={effect.effect} 
      />
    );
  };

  return (
    <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-xl rounded-2xl">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-semibold text-foreground">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mr-3">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          Logo Color Effects
        </CardTitle>
        <CardDescription className="text-base font-medium text-muted-foreground">
          Beautiful animated logo variations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {effects.map((effect, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center space-y-3 p-4 rounded-xl bg-muted/30 border border-border/30"
            >
              <div className="h-16 flex items-center justify-center">
                {renderLogo(effect)}
              </div>
              <div className="text-center">
                <p className="font-semibold text-sm">{effect.name}</p>
                <p className="text-xs text-muted-foreground">{effect.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LogoEffects;
