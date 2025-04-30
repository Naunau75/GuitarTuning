import { useMemo } from "react";

interface TunerDialProps {
  currentPitch: number | null;
  targetPitch: number;
  centsOff: number | null;
}

export default function TunerDial({ currentPitch, targetPitch, centsOff }: TunerDialProps) {
  // Limit the cents to display properly on the dial (-50 to +50 cents)
  const limitedCents = useMemo(() => {
    if (centsOff === null) return 0;
    return Math.max(-50, Math.min(50, centsOff));
  }, [centsOff]);
  
  // Convert cents to rotation angle (50 cents = ~45 degrees)
  const rotationAngle = useMemo(() => {
    return (limitedCents / 50) * 45;
  }, [limitedCents]);
  
  const tuningStatusText = useMemo(() => {
    if (centsOff === null) return "Play a string";
    
    if (Math.abs(centsOff) < 5) {
      return "In Tune";
    } else if (Math.abs(centsOff) < 15) {
      return "Almost There";
    } else {
      return "Out of Tune";
    }
  }, [centsOff]);
  
  const tuningStatusColor = useMemo(() => {
    if (centsOff === null) return "text-muted-foreground";
    
    if (Math.abs(centsOff) < 5) {
      return "text-success";
    } else if (Math.abs(centsOff) < 15) {
      return "text-warning";
    } else {
      return "text-error";
    }
  }, [centsOff]);
  
  const tuningStatusBg = useMemo(() => {
    if (centsOff === null) return "bg-muted/20";
    
    if (Math.abs(centsOff) < 5) {
      return "bg-success/10";
    } else if (Math.abs(centsOff) < 15) {
      return "bg-warning/10";
    } else {
      return "bg-error/10";
    }
  }, [centsOff]);
  
  const needleColor = useMemo(() => {
    if (centsOff === null) return "bg-muted-foreground";
    
    if (Math.abs(centsOff) < 5) {
      return "bg-success";
    } else if (Math.abs(centsOff) < 15) {
      return "bg-warning";
    } else {
      return "bg-error";
    }
  }, [centsOff]);
  
  return (
    <div className="relative my-6 flex flex-col items-center">
      {/* Tuner Dial */}
      <div className="relative w-[280px] h-[150px] bg-gradient-to-r from-primary/80 via-primary to-secondary/80 rounded-t-[150px] overflow-hidden mb-2 shadow-lg">
        {/* Dial markings - darker background for depth */}
        <div className="absolute inset-0 bg-black/20 rounded-t-[150px]"></div>
        
        {/* Inner glowing circle */}
        <div className="absolute left-1/2 top-[75px] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] rounded-full bg-gradient-to-b from-primary/5 to-transparent blur-md"></div>
        
        {/* Marker lines with glow effect */}
        <div className="flex justify-between px-10 pt-4 relative z-10">
          <div className="h-8 w-0.5 bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          <div className="h-8 w-0.5 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          <div className="h-8 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
          <div className="h-8 w-0.5 bg-white/50 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
          <div className="h-8 w-0.5 bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
        </div>
        
        {/* Labels with better styling */}
        <div className="flex justify-between px-8 text-white text-xs mt-1 font-medium relative z-10">
          <span className="opacity-70">♭</span>
          <span className="opacity-80">–</span>
          <span className="text-sm">◯</span>
          <span className="opacity-80">+</span>
          <span className="opacity-70">♯</span>
        </div>
        
        {/* Create a dark half-circle to mask the bottom of the dial */}
        <div className="absolute w-[290px] h-[290px] top-[120px] left-[-5px] rounded-full bg-card"></div>
        
        {/* Needle with glow effect */}
        <div 
          className={`absolute bottom-0 left-1/2 w-[3px] h-[110px] ${needleColor} z-10 transition-transform duration-300 ease-out origin-bottom shadow-[0_0_8px_rgba(255,255,255,0.7)]`}
          style={{ transform: `translateX(-50%) rotate(${rotationAngle}deg)` }}
        >
          {/* Needle dot at the bottom */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 ${needleColor} rounded-full shadow-[0_0_10px_rgba(255,255,255,0.7)]`}></div>
        </div>
      </div>
      
      {/* Status Indicator with pill styling */}
      <div className="text-center mb-4">
        <span className={`inline-block font-medium px-4 py-1.5 rounded-full ${tuningStatusColor} ${tuningStatusBg}`}>
          {tuningStatusText}
        </span>
      </div>
      
      {/* Pitch Display with modern styling */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        <div className="bg-muted/20 rounded-lg p-2 text-center">
          <div className="text-muted-foreground text-xs mb-1">Current</div>
          <div className="font-mono text-xl font-medium">
            {currentPitch ? currentPitch.toFixed(2) : "--.-"} <span className="text-xs">Hz</span>
          </div>
        </div>
        <div className="bg-primary/10 rounded-lg p-2 text-center">
          <div className="text-primary/70 text-xs mb-1">Target</div>
          <div className="font-mono text-xl font-medium text-primary">
            {targetPitch.toFixed(2)} <span className="text-xs">Hz</span>
          </div>
        </div>
      </div>
    </div>
  );
}
