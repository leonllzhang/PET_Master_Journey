export interface SynonymPair {
  word: string;
  correct: string;
  options: string[];
  topic?: string;
}

export const synonymBank: SynonymPair[] = [
  // ===== 情感与感受 (Feelings & Emotions) =====
  { word: "Happy", correct: "Delighted", options: ["Delighted", "Sad", "Tired"], topic: "情感" },
  { word: "Sad", correct: "Unhappy", options: ["Unhappy", "Glad", "Bright"], topic: "情感" },
  { word: "Angry", correct: "Furious", options: ["Furious", "Calm", "Brave"], topic: "情感" },
  { word: "Afraid", correct: "Frightened", options: ["Frightened", "Proud", "Quiet"], topic: "情感" },
  { word: "Surprised", correct: "Amazed", options: ["Amazed", "Bored", "Asleep"], topic: "情感" },
  { word: "Tired", correct: "Exhausted", options: ["Exhausted", "Energetic", "Awake"], topic: "情感" },
  { word: "Nervous", correct: "Anxious", options: ["Calm", "Anxious", "Brave"], topic: "情感" },
  { word: "Calm", correct: "Relaxed", options: ["Relaxed", "Worried", "Angry"], topic: "情感" },
  { word: "Proud", correct: "Pleased", options: ["Upset", "Pleased", "Ashamed"], topic: "情感" },
  { word: "Worried", correct: "Concerned", options: ["Concerned", "Careless", "Happy"], topic: "情感" },
  { word: "Shy", correct: "Timid", options: ["Timid", "Loud", "Brave"], topic: "情感" },
  { word: "Lonely", correct: "Isolated", options: ["Isolated", "Popular", "Cheerful"], topic: "情感" },

  // ===== 描述 (Adjectives - Size & Quality) =====
  { word: "Big", correct: "Enormous", options: ["Enormous", "Tiny", "Fast"], topic: "描述" },
  { word: "Small", correct: "Tiny", options: ["Tiny", "Huge", "Wide"], topic: "描述" },
  { word: "Fast", correct: "Rapid", options: ["Rapid", "Late", "Slow"], topic: "描述" },
  { word: "Old", correct: "Ancient", options: ["Ancient", "New", "Young"], topic: "描述" },
  { word: "New", correct: "Modern", options: ["Modern", "Broken", "Old"], topic: "描述" },
  { word: "Good", correct: "Excellent", options: ["Excellent", "Awful", "Simple"], topic: "描述" },
  { word: "Bad", correct: "Terrible", options: ["Terrible", "Great", "Gentle"], topic: "描述" },
  { word: "Nice", correct: "Lovely", options: ["Lovely", "Ugly", "Rude"], topic: "描述" },
  { word: "Pretty", correct: "Attractive", options: ["Attractive", "Ugly", "Rough"], topic: "描述" },
  { word: "Ugly", correct: "Horrible", options: ["Horrible", "Lovely", "Pretty"], topic: "描述" },
  { word: "Rich", correct: "Wealthy", options: ["Wealthy", "Poor", "Thin"], topic: "描述" },
  { word: "Cheap", correct: "Inexpensive", options: ["Inexpensive", "Costly", "Broken"], topic: "描述" },
  { word: "Expensive", correct: "Costly", options: ["Costly", "Cheap", "Simple"], topic: "描述" },
  { word: "Important", correct: "Essential", options: ["Essential", "Funny", "Heavy"], topic: "描述" },
  { word: "Difficult", correct: "Challenging", options: ["Challenging", "Simple", "Boring"], topic: "描述" },
  { word: "Easy", correct: "Simple", options: ["Simple", "Hard", "Heavy"], topic: "描述" },
  { word: "Strange", correct: "Peculiar", options: ["Peculiar", "Normal", "Common"], topic: "描述" },
  { word: "Clear", correct: "Obvious", options: ["Obvious", "Hidden", "Vague"], topic: "描述" },
  { word: "Quiet", correct: "Silent", options: ["Silent", "Loud", "Busy"], topic: "描述" },
  { word: "Brave", correct: "Courageous", options: ["Courageous", "Scared", "Weak"], topic: "描述" },
  { word: "Smart", correct: "Intelligent", options: ["Intelligent", "Lazy", "Slow"], topic: "描述" },
  { word: "Funny", correct: "Amusing", options: ["Amusing", "Serious", "Sad"], topic: "描述" },
  { word: "Kind", correct: "Generous", options: ["Generous", "Mean", "Strict"], topic: "描述" },
  { word: "Honest", correct: "Truthful", options: ["Truthful", "Dishonest", "Proud"], topic: "描述" },
  { word: "Famous", correct: "Well-known", options: ["Well-known", "Unknown", "Quiet"], topic: "描述" },
  { word: "Popular", correct: "Fashionable", options: ["Fashionable", "Uncommon", "Boring"], topic: "描述" },
  { word: "Dangerous", correct: "Risky", options: ["Risky", "Safe", "Easy"], topic: "描述" },
  { word: "Comfortable", correct: "Cosy", options: ["Cosy", "Uncomfortable", "Hard"], topic: "描述" },
  { word: "Strong", correct: "Powerful", options: ["Powerful", "Weak", "Gentle"], topic: "描述" },
  { word: "Weak", correct: "Frail", options: ["Frail", "Strong", "Brave"], topic: "描述" },
  { word: "Strict", correct: "Severe", options: ["Severe", "Gentle", "Kind"], topic: "描述" },
  { word: "Wide", correct: "Spacious", options: ["Spacious", "Narrow", "Short"], topic: "描述" },
  { word: "Main", correct: "Major", options: ["Major", "Minor", "Tiny"], topic: "描述" },
  { word: "Enough", correct: "Sufficient", options: ["Sufficient", "Lacking", "Extra"], topic: "描述" },
  { word: "Awful", correct: "Dreadful", options: ["Dreadful", "Great", "Gentle"], topic: "描述" },

  // ===== 行为动作 (Actions - Verbs) =====
  { word: "Start", correct: "Begin", options: ["Begin", "Stop", "Run"], topic: "动作" },
  { word: "Finish", correct: "Complete", options: ["Complete", "Start", "Fail"], topic: "动作" },
  { word: "Help", correct: "Assist", options: ["Assist", "Hurt", "Hide"], topic: "动作" },
  { word: "Show", correct: "Demonstrate", options: ["Demonstrate", "Cover", "Steal"], topic: "动作" },
  { word: "Choose", correct: "Select", options: ["Select", "Ignore", "Drop"], topic: "动作" },
  { word: "Think", correct: "Consider", options: ["Consider", "Forget", "Break"], topic: "动作" },
  { word: "Get", correct: "Obtain", options: ["Obtain", "Lose", "Give"], topic: "动作" },
  { word: "Need", correct: "Require", options: ["Require", "Have", "Waste"], topic: "动作" },
  { word: "Try", correct: "Attempt", options: ["Attempt", "Fail", "Skip"], topic: "动作" },
  { word: "Like", correct: "Enjoy", options: ["Enjoy", "Hate", "Avoid"], topic: "动作" },
  { word: "Hate", correct: "Detest", options: ["Detest", "Love", "Like"], topic: "动作" },
  { word: "Buy", correct: "Purchase", options: ["Purchase", "Sell", "Borrow"], topic: "动作" },
  { word: "Tell", correct: "Inform", options: ["Inform", "Hide", "Ask"], topic: "动作" },
  { word: "Ask", correct: "Request", options: ["Request", "Ignore", "Answer"], topic: "动作" },
  { word: "Answer", correct: "Reply", options: ["Reply", "Question", "Ignore"], topic: "动作" },
  { word: "Explain", correct: "Describe", options: ["Describe", "Confuse", "Hide"], topic: "动作" },
  { word: "Suggest", correct: "Recommend", options: ["Recommend", "Refuse", "Forbid"], topic: "动作" },
  { word: "Protect", correct: "Defend", options: ["Defend", "Attack", "Ignore"], topic: "动作" },
  { word: "Collect", correct: "Gather", options: ["Gather", "Scatter", "Lose"], topic: "动作" },
  { word: "Create", correct: "Produce", options: ["Produce", "Destroy", "Consume"], topic: "动作" },
  { word: "Destroy", correct: "Damage", options: ["Damage", "Build", "Create"], topic: "动作" },
  { word: "Prevent", correct: "Avoid", options: ["Avoid", "Cause", "Allow"], topic: "动作" },
  { word: "Receive", correct: "Accept", options: ["Accept", "Refuse", "Send"], topic: "动作" },
  { word: "Allow", correct: "Permit", options: ["Permit", "Forbid", "Stop"], topic: "动作" },
  { word: "Connect", correct: "Join", options: ["Join", "Split", "Break"], topic: "动作" },
  { word: "Divide", correct: "Separate", options: ["Separate", "Combine", "Keep"], topic: "动作" },
  { word: "Increase", correct: "Raise", options: ["Raise", "Lower", "Keep"], topic: "动作" },
  { word: "Decrease", correct: "Reduce", options: ["Reduce", "Increase", "Expand"], topic: "动作" },
  { word: "Correct", correct: "Accurate", options: ["Accurate", "Wrong", "Messy"], topic: "动作" },
  { word: "Win", correct: "Defeat", options: ["Defeat", "Lose", "Share"], topic: "动作" },
  { word: "Catch", correct: "Capture", options: ["Capture", "Release", "Miss"], topic: "动作" },
  { word: "Keep", correct: "Maintain", options: ["Maintain", "Abandon", "Lose"], topic: "动作" },
  { word: "Follow", correct: "Pursue", options: ["Pursue", "Lead", "Avoid"], topic: "动作" },
  { word: "Visit", correct: "Attend", options: ["Attend", "Miss", "Leave"], topic: "动作" },

  // ===== 名词与其他 (Nouns & Others) =====
  { word: "Story", correct: "Tale", options: ["Tale", "Fact", "News"], topic: "名词" },
  { word: "Job", correct: "Profession", options: ["Profession", "Hobby", "Game"], topic: "名词" },
  { word: "Money", correct: "Cash", options: ["Cash", "Paper", "Card"], topic: "名词" },
  { word: "Present", correct: "Gift", options: ["Gift", "Loss", "Borrow"], topic: "名词" },
  { word: "Picture", correct: "Photograph", options: ["Photograph", "Painting", "Mirror"], topic: "名词" },
  { word: "Chance", correct: "Opportunity", options: ["Opportunity", "Problem", "Mistake"], topic: "名词" },
  { word: "Problem", correct: "Difficulty", options: ["Difficulty", "Solution", "Benefit"], topic: "名词" },
  { word: "Mistake", correct: "Error", options: ["Error", "Success", "Truth"], topic: "名词" },
  { word: "Help", correct: "Assistance", options: ["Assistance", "Harm", "Refusal"], topic: "名词" },
  { word: "Journey", correct: "Trip", options: ["Trip", "Home", "Stop"], topic: "名词" },
  { word: "Idea", correct: "Thought", options: ["Thought", "Object", "Thing"], topic: "名词" },
  { word: "Aim", correct: "Goal", options: ["Goal", "Start", "Loss"], topic: "名词" },
  { word: "Power", correct: "Strength", options: ["Strength", "Weakness", "Fear"], topic: "名词" },
  { word: "Speed", correct: "Rate", options: ["Rate", "Stop", "Slowness"], topic: "名词" },
  { word: "Group", correct: "Team", options: ["Team", "One", "Alone"], topic: "名词" },
  { word: "Friend", correct: "Companion", options: ["Companion", "Stranger", "Enemy"], topic: "名词" },
  { word: "Border", correct: "Edge", options: ["Edge", "Center", "Inside"], topic: "名词" },
  { word: "Middle", correct: "Centre", options: ["Centre", "Edge", "Side"], topic: "名词" },
  { word: "Peace", correct: "Harmony", options: ["Harmony", "War", "Noise"], topic: "名词" },
  { word: "Prize", correct: "Award", options: ["Award", "Fine", "Price"], topic: "名词" },
];

export const totalPairs = synonymBank.length;

export const topics = [...new Set(synonymBank.filter(p => p.topic).map(p => p.topic!))];

export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getWordsByTopic(topic: string): SynonymPair[] {
  return synonymBank.filter((p) => p.topic === topic);
}
