import { GuitarString } from "@/lib/guitarStrings";
import { guitarStrings } from "@/lib/guitarStrings";

interface StringSelectorProps {
  selectedString: GuitarString;
  onStringChange: (string: GuitarString) => void;
}

export default function StringSelector({ selectedString, onStringChange }: StringSelectorProps) {
  return (
    <div className="w-full bg-card/80 backdrop-blur-md rounded-xl border border-muted/30 shadow-lg p-4">
      <div className="grid grid-cols-6 gap-2">
        {guitarStrings.map((stringData) => {
          const isSelected = selectedString.position === stringData.position;
          return (
            <button
              key={`${stringData.name}-${stringData.position}`}
              className={`
                py-3 px-1 text-center rounded-lg font-medium transition-all duration-300
                ${isSelected ? 
                  'bg-gradient-to-b from-primary to-primary/80 shadow-lg shadow-primary/20 scale-105 border-none' : 
                  'bg-muted/20 hover:bg-muted/40 border border-muted/30'}
              `}
              onClick={() => onStringChange(stringData)}
            >
              <div className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-foreground'}`}>
                {stringData.name}
              </div>
              <div className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-muted-foreground'}`}>
                {stringData.position}
                {stringData.position === 1 ? 'st' : 
                 stringData.position === 2 ? 'nd' : 
                 stringData.position === 3 ? 'rd' : 'th'}
              </div>
              {isSelected && (
                <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 animate-pulse"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
