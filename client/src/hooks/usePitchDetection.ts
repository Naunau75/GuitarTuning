import { useState, useCallback, useEffect, useRef } from "react";

// YIN pitch detection algorithm - specially optimized for guitar strings
const findPitch = (buffer: Float32Array, sampleRate: number): number | null => {
  // Implementation of the YIN algorithm for pitch detection
  // Optimized for guitar frequency range (80Hz - 330Hz for standard tuning)
  
  const DEFAULT_THRESHOLD = 0.15;
  const bufferLength = buffer.length;
  
  // For guitar pitch detection, we need sufficient buffer length
  if (bufferLength < 1024) return null;
  
  // Check if the signal is strong enough
  let sum = 0;
  for (let i = 0; i < bufferLength; i++) {
    sum += buffer[i] * buffer[i];
  }
  
  // RMS (root mean square) - measure of signal strength
  const rms = Math.sqrt(sum / bufferLength);
  if (rms < 0.01) return null; // Signal too weak
  
  // Create difference function array
  const yinBuffer = new Float32Array(bufferLength / 2);
  
  // Step 1: Calculate the squared difference for each lag
  for (let tau = 0; tau < yinBuffer.length; tau++) {
    yinBuffer[tau] = 0;
    
    for (let i = 0; i < yinBuffer.length; i++) {
      const delta = buffer[i] - buffer[i + tau];
      yinBuffer[tau] += delta * delta;
    }
  }
  
  // Step 2: Calculate the cumulative normalization
  // This helps eliminate octave errors by favoring lower frequencies when multiple candidates exist
  yinBuffer[0] = 1;
  let runningSum = 0;
  for (let tau = 1; tau < yinBuffer.length; tau++) {
    runningSum += yinBuffer[tau];
    yinBuffer[tau] *= tau / runningSum;
  }
  
  // Step 3: Find the first local minimum below the threshold
  let tau = 2; // Start at tau = 2 (ignoring initial values)
  let minTau = 0;
  let minVal = 1000; // Arbitrary high value
  
  // Calculate frequency bounds for guitar (E2 to E4)
  const highestFrequency = 340; // Just above high E string
  const lowestFrequency = 80;   // Just below low E string
  
  const lowestPeriod = Math.floor(sampleRate / highestFrequency);
  const highestPeriod = Math.floor(sampleRate / lowestFrequency);
  
  // Ensure we search only within guitar frequency range
  while (tau < yinBuffer.length) {
    if (tau >= lowestPeriod && tau <= highestPeriod) {
      if (yinBuffer[tau] < minVal) {
        minVal = yinBuffer[tau];
        minTau = tau;
      }
      
      // If we found a good enough match, use it
      if (minVal < DEFAULT_THRESHOLD) {
        // Interpolate for better accuracy
        const exactTau = interpolateMaximum(yinBuffer, minTau);
        return sampleRate / exactTau;
      }
    }
    tau++;
  }
  
  // If nothing found below threshold but we have a minimum, use it
  if (minTau > 0) {
    // Interpolate to refine the estimate
    const exactTau = interpolateMaximum(yinBuffer, minTau);
    return sampleRate / exactTau;
  }
  
  return null;
};

// Parabolic interpolation to get more precise frequency value
const interpolateMaximum = (array: Float32Array, index: number): number => {
  if (index <= 0 || index >= array.length - 1) return index;
  
  const s0 = array[index - 1];
  const s1 = array[index];
  const s2 = array[index + 1];
  
  const adjustment = 0.5 * (s0 - s2) / (s0 - 2 * s1 + s2);
  
  return index + adjustment;
};

export function usePitchDetection() {
  const [currentPitch, setCurrentPitch] = useState<number | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Store audio context related objects
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Start listening to microphone and detecting pitch
  const startListening = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      // Create audio context and nodes
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      
      const sourceNode = audioContext.createMediaStreamSource(stream);
      sourceNodeRef.current = sourceNode;
      
      const analyserNode = audioContext.createAnalyser();
      analyserNode.fftSize = 2048; // Must be power of 2
      analyserNodeRef.current = analyserNode;
      
      // Connect nodes: source -> analyser
      sourceNode.connect(analyserNode);
      
      // Buffer for frequency data
      const bufferLength = analyserNode.fftSize;
      const timeDataArray = new Float32Array(bufferLength);
      
      // Continuously analyze audio
      const updatePitch = () => {
        if (!analyserNodeRef.current || !audioContextRef.current) return;
        
        // Get audio waveform data
        analyserNodeRef.current.getFloatTimeDomainData(timeDataArray);
        
        // Calculate pitch using our custom YIN algorithm
        const detectedPitch = findPitch(timeDataArray, audioContextRef.current.sampleRate);
        
        if (detectedPitch !== null && detectedPitch > 50 && detectedPitch < 1500) {
          // Filter out very low and very high frequencies
          setCurrentPitch(detectedPitch);
        } else {
          setCurrentPitch(null);
        }
        
        // Continue animation loop
        animationFrameRef.current = requestAnimationFrame(updatePitch);
      };
      
      // Start the pitch detection loop
      animationFrameRef.current = requestAnimationFrame(updatePitch);
      setIsListening(true);
      console.log("Pitch detection started successfully", { 
        audioContextState: audioContext.state,
        sampleRate: audioContext.sampleRate
      });
      
    } catch (error) {
      console.error("Error starting pitch detection:", error);
      setIsListening(false);
    }
  }, []);
  
  // Stop listening and clean up resources
  const stopListening = useCallback(() => {
    // Cancel the animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    // Disconnect audio nodes
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect();
      sourceNodeRef.current = null;
    }
    
    // Stop all tracks in the media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(e => console.error("Error closing audio context:", e));
      audioContextRef.current = null;
    }
    
    setCurrentPitch(null);
    setIsListening(false);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isListening) {
        stopListening();
      }
    };
  }, [isListening, stopListening]);
  
  return {
    currentPitch,
    isListening,
    startListening,
    stopListening
  };
}
