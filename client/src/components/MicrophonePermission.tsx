import { Button } from "@/components/ui/button";

interface MicrophonePermissionProps {
  onPermissionGranted: () => void;
}

export default function MicrophonePermission({ onPermissionGranted }: MicrophonePermissionProps) {
  const requestMicrophoneAccess = async () => {
    try {
      // Just check if we can get microphone permission
      // The actual stream will be created in the pitch detection hook
      await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false
        } 
      });
      
      onPermissionGranted();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access your microphone. Please allow microphone access to use the tuner.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50">
      <div className="bg-card rounded-xl p-8 max-w-sm mx-4 shadow-xl border border-muted/30">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Microphone Access Required</h2>
        </div>
        
        <p className="text-foreground/80 mb-8 text-center">
          To detect your guitar's pitch, we need access to your microphone. Please allow access when prompted.
        </p>
        
        <div className="flex justify-center">
          <Button 
            onClick={requestMicrophoneAccess} 
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity text-white py-2 px-6 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
            Allow Microphone Access
          </Button>
        </div>
      </div>
    </div>
  );
}
