import { CHALLENGES } from './mockChallenges';

// Every challenge in the catalogue points at the same mock problem
// body for now — the shell only needs one solid example to prove out
// the layout. Stage C wires real per-challenge content behind it.
const GENERIC_BODY = {
  tags: ['Array', 'HashMap'],
  description:
    'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
    },
  ],
  starterCode:
    '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar solve = function(nums, target) {\n    // write your code here\n};\n',
  testCases: [
    { id: 1, input: 'nums = [2,7,11,15], target = 9', expected: '[0,1]' },
    { id: 2, input: 'nums = [3,2,4], target = 6', expected: '[1,2]' },
    { id: 3, input: 'nums = [3,3], target = 6', expected: '[0,1]' },
  ],
};

export function getChallengeDetail(id) {
  const numericId = Number(id);
  const meta = CHALLENGES.find((c) => c.id === numericId) ?? CHALLENGES[0];
  return {
    id: meta.id,
    title: meta.title,
    difficulty: meta.difficulty,
    ...GENERIC_BODY,
  };
}
