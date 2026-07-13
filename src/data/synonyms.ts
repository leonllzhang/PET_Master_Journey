export interface SynonymPair {
  word: string;
  correct: string;
  options: string[];
}

export const synonymBank: SynonymPair[] = [
  { word: "Important", correct: "Essential", options: ["Essential", "Funny", "Heavy"] },
  { word: "Attractive", correct: "Beautiful", options: ["Beautiful", "Ugly", "Small"] },
  { word: "Difficult", correct: "Challenging", options: ["Challenging", "Simple", "Boring"] },
  { word: "Happy", correct: "Delighted", options: ["Sad", "Delighted", "Tired"] },
  { word: "Big", correct: "Enormous", options: ["Tiny", "Enormous", "Fast"] },
  { word: "Smart", correct: "Intelligent", options: ["Intelligent", "Lazy", "Slow"] },
  { word: "Start", correct: "Begin", options: ["Stop", "Begin", "Run"] },
  { word: "Fast", correct: "Rapid", options: ["Rapid", "Late", "Wide"] },
  { word: "Old", correct: "Ancient", options: ["New", "Ancient", "Young"] },
  { word: "Rich", correct: "Wealthy", options: ["Poor", "Wealthy", "Thin"] },
  { word: "Angry", correct: "Furious", options: ["Furious", "Calm", "Brave"] },
  { word: "Cold", correct: "Freezing", options: ["Freezing", "Hot", "Warm"] },
  { word: "Tired", correct: "Exhausted", options: ["Exhausted", "Energetic", "Awake"] },
  { word: "Quiet", correct: "Silent", options: ["Silent", "Loud", "Busy"] },
  { word: "Brave", correct: "Courageous", options: ["Scared", "Courageous", "Weak"] },
  { word: "Choose", correct: "Select", options: ["Select", "Ignore", "Drop"] },
  { word: "Help", correct: "Assist", options: ["Assist", "Hurt", "Hide"] },
  { word: "Show", correct: "Demonstrate", options: ["Demonstrate", "Cover", "Steal"] },
  { word: "Think", correct: "Consider", options: ["Forget", "Consider", "Break"] },
  { word: "Get", correct: "Obtain", options: ["Obtain", "Lose", "Give"] },
  { word: "Nice", correct: "Pleasant", options: ["Pleasant", "Rude", "Dull"] },
  { word: "Sure", correct: "Certain", options: ["Certain", "Maybe", "Never"] },
  { word: "Strange", correct: "Peculiar", options: ["Normal", "Peculiar", "Common"] },
  { word: "Main", correct: "Major", options: ["Minor", "Major", "Tiny"] },
  { word: "Enough", correct: "Sufficient", options: ["Sufficient", "Lacking", "Extra"] },
  { word: "Clear", correct: "Obvious", options: ["Obvious", "Hidden", "Vague"] },
  { word: "Awful", correct: "Terrible", options: ["Terrible", "Great", "Gentle"] },
  { word: "Pretty", correct: "Lovely", options: ["Lovely", "Ugly", "Rough"] },
  { word: "Correct", correct: "Accurate", options: ["Accurate", "Wrong", "Messy"] },
  { word: "Risky", correct: "Dangerous", options: ["Dangerous", "Safe", "Easy"] },
];

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
