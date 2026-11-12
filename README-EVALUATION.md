# Dev Battle - Solution Evaluation System

## TL;DR

- **JavaScript**: ✅ Real execution in Web Worker (accurate results)
- **Python/C++/Java**: ⚠️ Simulated results (need Judge0 backend for real execution)
- **Scoring**: 55% correctness + 15% runtime + 10% memory + 20% speed
- **Winner**: Highest score wins, draws if within 0.5 points

---

## Current System Architecture

```
┌─────────────────────────────────────────────┐
│          User Submits Solution              │
└──────────────┬──────────────────────────────┘
               │
               v
      ┌────────────────┐
      │ Judge Service  │
      └───────┬────────┘
              │
     ┌────────┴────────┐
     │                 │
     v                 v
┌─────────┐      ┌──────────┐
│JavaScript│      │Other Langs│
│  REAL   │      │ SIMULATED│
└────┬────┘      └─────┬────┘
     │                 │
     v                 v
┌──────────────────────────┐
│   Scoring & Comparison   │
└──────────┬───────────────┘
           │
           v
    ┌─────────────┐
    │   Winner    │
    └─────────────┘
```

---

## How JavaScript Gets Evaluated (Real)

### Step-by-Step Process

1. **Code Parsing**
   ```javascript
   // Your code
   function pairSum(nums, target) {
     const seen = new Map();
     for (let i = 0; i < nums.length; i++) {
       const need = target - nums[i];
       if (seen.has(need)) return [seen.get(need), i];
       seen.set(nums[i], i);
     }
   }
   ```

2. **Web Worker Execution**
   - Code sent to isolated worker thread
   - Function extracted and called with test inputs
   - Sandboxed `console` captures logs

3. **Test Execution**
   ```javascript
   // Test 1
   Input: pairSum([2, 7, 11, 15], 9)
   Expected: [0, 1]
   Got: [0, 1] ✓
   Time: 0.12ms
   
   // Test 2
   Input: pairSum([3, 2, 4], 6)
   Expected: [1, 2]
   Got: [1, 2] ✓
   Time: 0.08ms
   ```

4. **Results Aggregated**
   ```
   Verdict: Accepted
   Passed: 2/2 tests
   Runtime: 0.20ms (sum of all tests)
   Memory: 39.4 MB (estimated)
   Console: [any console.log output]
   ```

### Safety Features

✅ **Isolated Worker Thread** - Can't access main page
✅ **Hard Timeout** - Kills infinite loops
✅ **No DOM Access** - Can't manipulate page
✅ **No Network** - Can't make fetch requests
✅ **Sandboxed Console** - Logs captured safely

---

## How Python/C++/Java Get Evaluated (Simulated)

### Current Behavior

Since these languages need compilation and isolated execution, they are **simulated** until a backend judge is configured:

1. **Basic Code Analysis**
   ```python
   # Your Python code
   class Solution:
       def pairSum(self, nums, target):
           seen = {}
           for i, n in enumerate(nums):
               if target - n in seen:
                   return [seen[target - n], i]
               seen[n] = i
   ```

2. **Simulation Logic**
   - Checks if code looks empty/incomplete
   - First 2 tests usually pass
   - ~12% random failure rate on remaining tests
   - Generates realistic runtime/memory for language

3. **Flagged Results**
   ```
   Verdict: Accepted
   Passed: 8/10 tests
   Runtime: 92.4ms (simulated)
   Memory: 18.2 MB (simulated)
   Console: ["[simulated] python requires the backend judge. Results below are illustrative."]
   Executed: false ⚠️
   ```

### Why Simulation?

Real execution requires:
- **Judge0** or similar backend service
- **Docker containers** for isolation
- **Compiler infrastructure** for each language
- **Security controls** to prevent malicious code

---

## Scoring System Explained

### Score Components (100 points total)

#### 1. Correctness (55 points)
```
Score = 55 × (tests_passed / total_tests)

Examples:
10/10 tests = 55.0 points
 8/10 tests = 44.0 points
 5/10 tests = 27.5 points
```

#### 2. Runtime (15 points)
```
If your code is faster:
  Score = 15 × (their_time / your_time) × ratio

If equal or slower:
  Score = 15 × ratio

ratio = tests_passed / total_tests
```

**Noise floor:** Differences < 1ms or < 15% count as tied

#### 3. Memory (10 points)
```
If you use less memory:
  Score = 10 × (their_memory / your_memory) × ratio

Works same as runtime
```

**Noise floor:** Differences < 1MB or < 15% count as tied

#### 4. Speed (20 points)
```
Score = 20 × (1 - submission_time / battle_duration) × ratio

Examples:
Submit at 30s of 120s battle = 20 × (1 - 30/120) = 15.0 points
Submit at 60s of 120s battle = 20 × (1 - 60/120) = 10.0 points
Submit at 90s of 120s battle = 20 × (1 - 90/120) = 5.0 points
```

### Winner Decision

1. **Different correctness?** → Higher wins
   - 10/10 always beats 9/10

2. **Same correctness?** → Higher total score wins
   - Runtime + Memory + Speed decide

3. **Scores within 0.5?** → Draw
   - Too close to determine winner

---

## Test Case System

### Test Case Structure

```typescript
{
  args: [[2, 7, 11, 15], 9],  // Function arguments
  expected: [0, 1],            // Expected output
  hidden: false                // Visible or hidden?
}
```

### Visible vs Hidden Tests

**Visible Tests** (Run Code):
- Shown in problem description
- User can see input/output
- Unlimited runs
- 2-3 tests per problem
- For development and debugging

**Hidden Tests** (Submit Only):
- Not shown until submission
- Test edge cases
- 3-5 tests per problem
- For validation

**Example:**
```javascript
// Visible
Test 1: [2,7,11,15], 9 → [0,1]
Test 2: [3,2,4], 6 → [1,2]

// Hidden (only seen on submit)
Test 3: [3,3], 6 → [0,1]               // Duplicate elements
Test 4: [-1,-2,-3,-4,-5], -8 → [2,4]  // Negative numbers
Test 5: [0,4,3,0], 0 → [0,3]          // Zero target
```

---

## Verdict Types

| Verdict | When It Happens | Example |
|---------|-----------------|---------|
| **Accepted** ✅ | All tests pass | Perfect solution |
| **Wrong Answer** ❌ | Output ≠ expected | Logic error, missed case |
| **Runtime Error** 💥 | Exception thrown | `undefined.length`, division by zero |
| **Compilation Error** 🔴 | Syntax error | Missing bracket, wrong function name |
| **Time Limit Exceeded** ⏱️ | Timeout reached | Infinite loop, O(n²) on large input |

---

## Performance Measurement

### Runtime

**JavaScript (Measured)**:
```javascript
const start = performance.now();
const result = yourFunction(...args);
const time = performance.now() - start; // Actual milliseconds
```

**Other Languages (Estimated)**:
- Base time for language + random variance
- C++: 12-42ms
- Java: 64-94ms
- Python: 88-118ms

### Memory

**All Languages (Estimated)**:
```javascript
memory = 38.6 + 
         (data_structures_count × 0.35) + 
         (input_size / 2048) + 
         small_random_factor
```

Different base values per language:
- JavaScript: ~39 MB
- Python: ~17 MB
- C++: ~9 MB
- Java: ~44 MB

---

## Battle Flow

```
┌──────────────────────────────────────────┐
│ 1. Battle Starts (3-2-1 countdown)      │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│ 2. Both Players Code (simultaneous)      │
│    - Write solution                      │
│    - Run tests (unlimited)               │
│    - See opponent typing                 │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│ 3. Submit Solution (once only)           │
│    - All tests execute                   │
│    - Timer records submission time       │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│ 4. Judging Phase                         │
│    - Tests run for both players          │
│    - Scores calculated                   │
│    - Winner determined                   │
└──────────────┬───────────────────────────┘
               │
┌──────────────▼───────────────────────────┐
│ 5. Results & Analysis                    │
│    - Score breakdown shown               │
│    - AI explains decision                │
│    - Rating updated                      │
└──────────────────────────────────────────┘
```

---

## Common Issues & Solutions

### Issue: "Function not defined"
**Cause:** Function name doesn't match starter code
**Fix:** Keep the exact function name from the template

### Issue: "Time Limit Exceeded"
**Cause:** Infinite loop or O(n²) algorithm on large input
**Fix:** Check for infinite loops, optimize algorithm

### Issue: "Wrong Answer on hidden test"
**Cause:** Missed edge case
**Fix:** Think about: empty arrays, single elements, negatives, duplicates, zeros

### Issue: "Runtime Error: Cannot read property"
**Cause:** Accessing undefined variable/property
**Fix:** Add null checks, validate inputs

---

## Enabling Real Execution for All Languages

### Option 1: Judge0 (Recommended)

1. **Install Judge0**
   ```bash
   docker run -d \
     -p 2358:2358 \
     --name judge0 \
     judge0/judge0:latest
   ```

2. **Configure Environment**
   ```bash
   # .env.local
   NEXT_PUBLIC_JUDGE_URL=http://localhost:2358
   ```

3. **Update Judge Service**
   - Modify `lib/services/judge.ts`
   - Add Judge0 API calls
   - Map language IDs (JS=63, Python=71, C++=54, Java=62)

### Option 2: Custom Backend

Build your own judge:
- Isolated containers (Docker)
- Language runtimes
- Resource limits
- Timeout handling
- Result parsing

---

## Files You Should Know

| File | Purpose |
|------|---------|
| `lib/services/judge.ts` | Main evaluation logic |
| `lib/services/scoring.ts` | Score calculation |
| `lib/services/ai.ts` | Battle analysis explanations |
| `lib/mock-data/problems.ts` | Problem definitions with tests |
| `types/index.ts` | TypeScript interfaces |

---

## Quick Stats

- **25 Problems** currently available
- **~120 Test Cases** total
- **100 Reference Solutions** (25 × 4 languages)
- **JavaScript** fully functional
- **3 Other Languages** waiting for backend

---

## Next Steps

1. **For Users**: Practice with JavaScript for real execution
2. **For Developers**: Set up Judge0 for full language support
3. **For Content**: Add more problems using the templates

📚 **Full Documentation**: See `SOLUTION-EVALUATION.md`
🎯 **Quick Reference**: See `EVALUATION-QUICK-REFERENCE.md`
