import { useState, useEffect } from "react";
import MicrophonePermission from "./MicrophonePermission";
import TunerCard from "./TunerCard";
import InstructionsCard from "./InstructionsCard";
import StringSelector from "./StringSelector";
import { GuitarString } from "@/lib/guitarStrings";
import { usePitchDetection } from "@/hooks/usePitchDetection";

export default function TunerApp() {
  const [selectedString, setSelectedString] = useState<GuitarString>({
    name: "E",
    position: 6,
    nickname: "Low E",
    scientific: "E2",
    frequency: 82.41
  });
  
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const { currentPitch, isListening, startListening, stopListening } = usePitchDetection();
  
  useEffect(() => {
    if (isPermissionGranted && !isListening) {
      startListening();
    }
    
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isPermissionGranted, isListening, startListening, stopListening]);
  
  const handleStringChange = (newString: GuitarString) => {
    setSelectedString(newString);
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
