const forbiddenWords = [
  'violence', 'sex', 'drugs', 'hack', 'kill', 'murder', 'bomb', 'terror',
  'porn', 'gambling', 'religion', 'politics', 'suicide', 'death', 'weapon',
  'racism', 'racist', 'abuse', 'attack'
];

export const isAcademicPrompt = (text) => {
  const lowerText = text.toLowerCase();
  return !forbiddenWords.some(word => lowerText.includes(word));
};
