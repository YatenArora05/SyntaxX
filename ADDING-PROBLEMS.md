# Adding 100 Problems to Dev Battle

## Current Status ✅

1. **Database Schema Updated** - `problems` table now stores `referenceSolutions` for all 4 languages (JS, Python, C++, Java)
2. **Helper Functions Ready** - Use `ref()` to define solutions in all languages

## The Challenge

Creating 100 fully-specified problems requires:
- 100 unique problem statements with examples
- 100 × 4 = 400 working solutions across 4 languages
- 500-800 test cases with expected outputs
- ~15,000-20,000 lines of carefully crafted code

**This is a multi-week manual task.**

## Recommended Solutions

### Option A: AI-Generated Problems (Fast, Good Quality) ⭐ RECOMMENDED

Use Claude/GPT to generate problems in batches:

1. Create prompts with your schema as template
2. Generate 10-20 problems at a time
3. Review and validate each batch
4. Seed to database

**Time: 4-6 hours for 100 problems**

### Option B: Curated Quality Set (Best for MVP)

Start with 25-30 hand-crafted problems covering:
- Common patterns (arrays, strings, trees, graphs)
- Varied difficulty (60% Easy, 30% Medium, 10% Hard)
- Well-tested edge cases

**Time: 2-3 days, but highest quality**

### Option C: Import Open Dataset

Sources:
- LeetCode unofficial API/datasets
- Codeforces problems via API
- Project Euler (math focus)

**Challenge:** Need to transform to your schema and write solutions

## Next Steps

Choose your approach:

1. **For AI Generation**: I'll create a generator script using your existing problem format as a template
2. **For Manual Curation**: I'll create 25 starter problems you can extend
3. **For Import**: I'll create an adapter script for LeetCode/Codeforces data

Which approach works best for your timeline?
