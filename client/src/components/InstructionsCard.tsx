export default function InstructionsCard() {
  return (
    <div className="bg-card/80 backdrop-blur-md rounded-xl border border-muted/30 shadow-lg w-full p-4">
      <details>
        <summary className="cursor-pointer font-medium flex items-center gap-2 text-primary">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">How to use this tuner</span>
        </summary>
        <div className="mt-4 text-sm text-foreground/80 space-y-3 pl-8">
          <p className="flex items-center gap-2 border-l-2 border-primary/30 pl-3">
            <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">1</span>
            Select the string you want to tune using the buttons below
          </p>
          <p className="flex items-center gap-2 border-l-2 border-primary/30 pl-3">
            <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">2</span>
            Pluck the string on your guitar
          </p>
          <p className="flex items-center gap-2 border-l-2 border-primary/30 pl-3">
            <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">3</span>
            Adjust your tuning pegs until the needle centers
          </p>
          <p className="flex items-center gap-2 border-l-2 border-primary/30 pl-3">
            <span className="bg-primary/20 text-primary rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">4</span>
            A centered needle and green indicator means your string is in tune
          </p>
          
          <div className="mt-4 mb-2 border-t border-muted/20 pt-4">
            <p className="text-secondary font-medium mb-2">Pro Tips:</p>
            <p className="flex items-center gap-2 pl-3 text-xs mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
              Enable Auto-detect to automatically select the string you're playing
            </p>
            <p className="flex items-center gap-2 pl-3 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-secondary"></span>
              For best results, keep background noise to a minimum
            </p>
          </div>
        </div>
      </details>
    </div>
  );
}
