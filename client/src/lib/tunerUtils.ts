/**
 * Calculate the cents difference between current and target frequencies
 * 100 cents = 1 semitone in musical theory
 */
export function calculateCentsOff(currentFreq: number, targetFreq: number): number {
  // Calculate cents off (1200 * log2(freq1/freq2))
  return 1200 * Math.log2(currentFreq / targetFreq);
}

/**
 * Get the closest guitar string to the detected frequency
 */
export function getClosestNote(frequency: number, strings: any[]): any {
  if (!frequency || !strings.length) return null;
  
  let closestString = strings[0];
  let smallestDifference = Math.abs(calculateCentsOff(frequency, strings[0].frequency));
  
  for (let i = 1; i < strings.length; i++) {
    const difference = Math.abs(calculateCentsOff(frequency, strings[i].frequency));
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestString = strings[i];
    }
  }
  
  return closestString;
}
