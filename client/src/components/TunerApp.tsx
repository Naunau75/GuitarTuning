import { useState, useEffect } from "react";
import MicrophonePermission from "./MicrophonePermission";
import TunerCard from "./TunerCard";
import InstructionsCard from "./InstructionsCard";
import StringSelector from "./StringSelector";
import { GuitarString, guitarStrings } from "@/lib/guitarStrings";
import { usePitchDetection } from "@/hooks/usePitchDetection";
import { getClosestNote } from "@/lib/tunerUtils";

export default function TunerApp() {
  const [selectedString, setSelectedString] = useState<GuitarString>({
    name: "E",
    position: 6,
    nickname: "Low E",
    scientific: "E2",
    frequency: 82.41
  });
  
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [autoDetect, setAutoDetect] = useState(false);
  const { currentPitch, isListening, startListening, stopListening } = usePitchDetection();
  
  // Effect for microphone control
  useEffect(() => {
    if (isPermissionGranted && !isListening) {
      console.log("Starting pitch detection...");
      startListening();
    }
    
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isPermissionGranted, isListening, startListening, stopListening]);
  
  // Effect for auto-detection of string being played
  useEffect(() => {
    if (autoDetect && currentPitch && currentPitch > 50) {
      const closestString = getClosestNote(currentPitch, guitarStrings);
      if (closestString && Math.abs(closestString.frequency - currentPitch) < 30) {
        setSelectedString(closestString);
      }
    }
  }, [autoDetect, currentPitch]);

  const handleStringChange = (newString: GuitarString) => {
    setSelectedString(newString);
  };
  
  const toggleAutoDetect = () => {
    setAutoDetect(prev => !prev);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/70 flex flex-col items-center justify-between p-6 md:p-8">
      {!isPermissionGranted && (
        <MicrophonePermission
          onPermissionGranted={() => setIsPermissionGranted(true)}
        />
      )}
      
      <header className="w-full max-w-lg text-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
          Guitar Tuner
        </h1>
        <p className="text-muted-foreground mt-2">Fine-tune your instrument with precision</p>
        
        {isPermissionGranted && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={toggleAutoDetect}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                autoDetect 
                  ? "bg-primary/20 text-primary" 
                  : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${autoDetect ? "bg-primary animate-pulse" : "bg-muted"}`}></span>
              {autoDetect ? "Auto-detect ON" : "Auto-detect OFF"}
            </button>
            
            {currentPitch && currentPitch > 50 ? (
              <div className="bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm">
                Signal detected
              </div>
            ) : (
              <div className="bg-muted/20 text-muted-foreground px-3 py-1.5 rounded-full text-sm">
                No signal
              </div>
            )}
          </div>
        )}
      </header>
      
      <main className="w-full max-w-lg flex flex-col items-center flex-grow">
        <div className="w-full backdrop-blur-sm bg-card/40 rounded-2xl border border-muted p-1 shadow-xl">
          <TunerCard
            selectedString={selectedString}
            currentPitch={currentPitch}
          />
        </div>
        
        <div className="w-full mt-6 backdrop-blur-sm bg-card/40 rounded-2xl border border-muted p-1 shadow-lg">
          <InstructionsCard />
        </div>
      </main>
      
      <div className="w-full max-w-lg mt-6 backdrop-blur-sm bg-card/40 rounded-2xl border border-muted p-1 shadow-lg">
        <StringSelector
          selectedString={selectedString}
          onStringChange={handleStringChange}
        />
      </div>
    </div>
  );
}
