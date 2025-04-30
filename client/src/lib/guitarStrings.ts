export interface GuitarString {
  name: string;
  position: number;
  nickname: string;
  scientific: string;
  frequency: number;
}

export const guitarStrings: GuitarString[] = [
  { name: "E", position: 6, nickname: "Low E", scientific: "E2", frequency: 82.41 },
  { name: "A", position: 5, nickname: "A", scientific: "A2", frequency: 110.00 },
  { name: "D", position: 4, nickname: "D", scientific: "D3", frequency: 146.83 },
  { name: "G", position: 3, nickname: "G", scientific: "G3", frequency: 196.00 },
  { name: "B", position: 2, nickname: "B", scientific: "B3", frequency: 246.94 },
  { name: "E", position: 1, nickname: "High E", scientific: "E4", frequency: 329.63 }
];
