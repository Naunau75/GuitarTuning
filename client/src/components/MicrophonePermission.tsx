import { Button } from "@/components/ui/button";

interface MicrophonePermissionProps {
  onPermissionGranted: () => void;
}

export default function MicrophonePermission({ onPermissionGranted }: MicrophonePermissionProps) {
  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Stop the tracks immediately, we just needed the permission
      stream.getTracks().forEach(track => track.stop());
      onPermissionGranted();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Unable to access your microphone. Please allow microphone access to use the tuner.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-lg">
        <h2 className="text-xl font-medium text-dark mb-4">Microphone Access Required</h2>
        <p className="text-gray-600 mb-4">
          To detect your guitar's pitch, we need access to your microphone. Please allow access when prompted.
        </p>
        <div className="flex justify-end">
          <Button onClick={requestMicrophoneAccess}>
            Allow Access
          </Button>
        </div>
      </div>
    </div>
  );
}
