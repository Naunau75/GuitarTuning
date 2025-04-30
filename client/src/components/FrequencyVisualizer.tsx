import { useMemo } from "react";

interface FrequencyVisualizerProps {
  centsOff: number | null;
}

export default function FrequencyVisualizer({ centsOff }: FrequencyVisualizerProps) {
  // Number of bars to display
  const barCount = 60;
  
  // Calculate bars data
  const bars = useMemo(() => {
    const centerBar = Math.floor(barCount / 2);
    const limitedCents = centsOff !== null ? Math.max(-50, Math.min(50, centsOff)) : 0;
    const offset = (limitedCents / 50) * 20; // Map centsOff to a reasonable offset value
    
    // Determine color based on tuning status
    let primaryColor = "from-primary to-secondary";
    let secondaryColor = "from-primary/40 to-secondary/40";
    
    if (centsOff !== null) {
      if (Math.abs(centsOff) < 5) {
        primaryColor = "from-success to-success/80";
        secondaryColor = "from-success/40 to-success/20";
      } else if (Math.abs(centsOff) < 15) {
        primaryColor = "from-warning to-warning/80";
        secondaryColor = "from-warning/40 to-warning/20";
      } else {
        primaryColor = "from-error to-error/80";
        secondaryColor = "from-error/40 to-error/20";
      }
    }
    
    return Array.from({ length: barCount }).map((_, index) => {
      // Calculate height based on position relative to the center and cents off
      // Create a bell curve with the peak following the tuning
      const adjustedDistanceFromCenter = Math.abs(index - (centerBar + offset));
      
      // Calculate bar height (bell curve, max at the adjusted center)
      let height = 70 * Math.exp(-0.06 * Math.pow(adjustedDistanceFromCenter, 2));
      
      // Add some controlled randomness for a more natural look
      // More randomness for higher frequencies (right side)
      const randomFactor = index > centerBar ? 0.8 : 0.6;
      height += (Math.random() * 10 * randomFactor) - (5 * randomFactor);
      height = Math.max(3, Math.min(70, height));
      
      // Wider bars in the center, thinner at the edges
      const widthFactor = 1 - (Math.abs(index - centerBar) / centerBar) * 0.5;
      const width = Math.max(0.8, widthFactor * 3);
      
      // Smoother animation for a more natural feel
      const animationDelay = Math.abs(index - centerBar) * 5;
      
      // Main bars vs background bars for a layered effect
      const isMainBar = height > 25;
      
      return { 
        height, 
        width,
        animationDelay,
        color: isMainBar ? primaryColor : secondaryColor
      };
    });
  }, [centsOff, barCount]);
  
  return (
    <div className="relative h-[80px] w-full my-6 rounded-lg overflow-hidden p-2 bg-gradient-to-b from-muted/20 to-transparent border border-muted/30">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent"></div>
      
      {/* Horizontal reference lines */}
      <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-muted/20"></div>
      <div className="absolute inset-x-0 top-1/2 border-t border-dashed border-muted/30"></div>
      <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-muted/20"></div>
      
      {/* Vertical center line */}
      <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-muted/30"></div>
      
      <div className="flex items-end h-full w-full justify-center relative z-10">
        {bars.map((bar, index) => (
          <div
            key={index}
            className={`mx-[0.5px] rounded-t-sm bg-gradient-to-t ${bar.color} transition-all ease-out shadow-lg`}
            style={{ 
              height: `${bar.height}px`,
              width: `${bar.width}px`,
              transitionDuration: `${150 + bar.animationDelay}ms`,
              transitionDelay: `${bar.animationDelay}ms`
            }}
          />
        ))}
      </div>
    </div>
  );
}
