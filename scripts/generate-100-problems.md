# Generating 100 Problems

Given the scale of creating 100 fully-specified problems with test cases and solutions in 4 languages, here's the recommended approach:

## Option 1: Use an AI Service (Recommended)

Create a script that calls an AI API (OpenAI, Claude, etc.) to generate problems in your schema format.

```typescript
// Pseudo-code for generation
for (let i = 0; i < 100; i++) {
  const problem = await ai.generate({
    prompt: "Generate a coding problem with test cases and solutions in JS, Python, C++, Java",
    schema: problemSchema,
    difficulty: getDifficulty(i), // 40 Easy, 40 Medium, 20 Hard
  });
  problems.push(problem);
}
```

## Option 2: Import from Existing Datasets

Use open-source problem datasets:
- **LeetCode unofficial dumps** (search GitHub for "leetcode-problems-json")
- **Codeforces API** - real competitive programming problems
- **Project Euler** - math-focused problems

## Option 3: Manual Curation (Best Quality)

Create 25-50 high-quality, well-tested problems manually. Quality > Quantity for a battle game.

## Current Status

I've updated your schema to support `referenceSolutions` with all 4 languages.

To proceed, choose ONE approach and I'll implement it fully:
1. AI-powered generator script
2. Import script from an existing dataset
3. Manual curation of 30 high-quality problems

Which would you prefer?
