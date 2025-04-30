import { useState, useCallback, useEffect, useRef } from "react";
import * as Tone from "tone";

export function usePitchDetection() {
  const [currentPitch, setCurrentPitch] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);
  const pitchDetectorRef = useRef<Tone.PitchDetect | null>(null);
  const micRef = useRef<Tone.UserMedia | null>(null);
  const analyserRef = useRef<Tone.Analyser | null>(null);
  
  // Start listening to microphone and detecting pitch
  const startListening = useCallback(async () => {
    try {
      // Ensure Tone.js is started (required for audio processing)
      await Tone.start();
      
      // Create the microphone input
      const mic = new Tone.UserMedia();
      await mic.open();
      
      // Create a pitch detector
      const pitchDetector = new Tone.PitchDetect();
      
      // Connect the microphone to the pitch detector
      mic.connect(pitchDetector);
      
      // Create an analyser for visualization
      const analyser = new Tone.Analyser("fft", 1024);
      mic.connect(analyser);
      
      // Store references
      micRef.current = mic;
      pitchDetectorRef.current = pitchDetector;
      analyserRef.current = analyser;
      
      // Setup an interval to get pitch data
      const intervalId = setInterval(() => {
        if (pitchDetectorRef.current) {
          const frequency = pitchDetectorRef.current.frequency;
          
          // Only update if we have a valid frequency (above noise floor)
          if (frequency > 20) {
            setCurrentPitch(frequency);
          } else {
            // If no significant audio is detected, set to null
            setCurrentPitch(null);
          }
        }
      }, 100);
      
      setIsListening(true);
      
      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error starting pitch detection:", error);
      setIsListening(false);
    }
  }, []);
  
  // Stop listening and clean up
  const stopListening = useCallback(() => {
    if (micRef.current) {
      micRef.current.close();
    }
    setIsListening(false);
    setCurrentPitch(null);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (micRef.current) {
        micRef.current.close();
      }
    };
  }, []);
  
  return {
    currentPitch,
    isListening,
    startListening,
    stopListening
  };
}
