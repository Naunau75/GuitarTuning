import { GuitarString } from "@/lib/guitarStrings";
import TunerDial from "./TunerDial";
import FrequencyVisualizer from "./FrequencyVisualizer";
import { calculateCentsOff } from "@/lib/tunerUtils";

interface TunerCardProps {
  selectedString: GuitarString;
  currentPitch: number | null;
}

export default function TunerCard({ selectedString, currentPitch }: TunerCardProps) {
  const centsOff = currentPitch 
    ? calculateCentsOff(currentPitch, selectedString.frequency)
    : null;
  
  return (
    <div className="bg-card/80 backdrop-blur-md rounded-2xl shadow-lg w-full p-6 flex flex-col items-center">
      {/* Current String Display */}
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center">
          <h2 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">{selectedString.name}</h2>
          <div className="ml-3 bg-primary/10 rounded-lg px-2 py-1">
            <span className="text-sm font-medium text-primary">
              {selectedString.position}
              {selectedString.position === 1 ? 'st' : 
               selectedString.position === 2 ? 'nd' : 
               selectedString.position === 3 ? 'rd' : 'th'}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-1 text-sm text-muted-foreground">
          <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-md">{selectedString.nickname}</span>
          <span>•</span>
          <span className="font-mono">{selectedString.scientific}</span>
          <span>•</span>
          <span className="font-mono">{selectedString.frequency.toFixed(2)} Hz</span>
        </div>
      </div>

      <TunerDial
        currentPitch={currentPitch}
        targetPitch={selectedString.frequency}
        centsOff={centsOff}
      />
      
      <FrequencyVisualizer 
        centsOff={centsOff}
      />
      
      <div className="mt-4 text-center text-sm bg-muted/30 rounded-lg px-3 py-2 text-muted-foreground">
        <p>Pluck the string and adjust until the needle centers</p>
      </div>
    </div>
  );
}
