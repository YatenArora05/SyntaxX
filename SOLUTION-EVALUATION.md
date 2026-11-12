# How Solution Evaluation Works

## Overview

Dev Battle uses a **dual-judging system**: real code execution for JavaScript and simulated evaluation for other languages (until a backend judge is configured).

## Architecture

```
User Submits Code
       ↓
   judge() function
       ↓
  ┌────────────┐
  │ JavaScript? │
  └─────┬──────┘
    YES │  NO
        │   ↓
        │  simulateRun()
        │  (Python, C++, Java)
        ↓
   runJavaScript()
   (Web Worker)
        ↓
   Test Execution
        ↓
   RunResult
        ↓
   Scoring System
        ↓
   Winner Decision
```

---

## 1. JavaScript Evaluation (Real Execution) ✅

### How It Works

**Location**: `lib/services/judge.ts` → `runJavaScript()`

JavaScript code is **genuinely executed** in a sandboxed Web Worker:

1. **Code Compilation**
   - User's code is wrapped in a Function constructor
   - Function name is extracted from the problem
   - Sandboxed `console` object intercepts logs

2. **Execution in Web Worker**
   - Code runs in isolated worker thread
   - Protects main thread from infinite loops
   - Hard timeout: `max(2000ms, timeLimitMs × 2)`
   - Each test case runs with `structuredClone` of inputs

3. **Test Case Execution**
   ```javascript
   for (const test of tests) {
     const args = structuredClone(test.args);
     const output = solve(...args);
     // Compare output with expected
   }
   ```

4. **Results Collected**
   - Actual runtime (performance.now())
   - Memory estimate (based on code structures)
   - Console logs
   - Errors and stack traces

### Verdicts

| Verdict | Meaning |
|---------|---------|
| **Accepted** | All tests passed ✅ |
| **Wrong Answer** | Output doesn't match expected |
| **Runtime Error** | Exception thrown during execution |
| **Compilation Error** | Syntax error or function not defined |
| **Time Limit Exceeded** | Worker timeout reached |

### Example Flow

```javascript
// User's code
function pairSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
}

// Judge runs:
Test 1: pairSum([2,7,11,15], 9)
  ✓ Expected: [0,1], Got: [0,1] - PASSED (0.12ms)

Test 2: pairSum([3,2,4], 6)
  ✓ Expected: [1,2], Got: [1,2] - PASSED (0.08ms)

// Final result:
Verdict: Accepted
Passed: 2/2
Runtime: 0.20ms
Memory: 39.4 MB
```

---

## 2. Other Languages (Simulated) ⚠️

### How It Works

**Location**: `lib/services/judge.ts` → `simulateRun()`

Python, C++, and Java use **simulated evaluation** until a backend judge is configured:

1. **Code Analysis**
   - Checks if code looks empty/incomplete
   - Simulates success rate based on code complexity

2. **Simulated Results**
   - First 2 tests usually pass
   - Random failure rate: ~12% per test
   - Realistic runtime/memory for each language

3. **Flagged as Simulated**
   - `executed: false` in results
   - UI shows "simulated judge" label
   - Console displays: `[simulated] {language} requires the backend judge`

### Language-Specific Baselines

| Language | Base Runtime | Memory |
|----------|-------------|---------|
| C++ | 12-42ms | 9-13 MB |
| Java | 64-94ms | 44-48 MB |
| Python | 88-118ms | 17-21 MB |
| JavaScript | 40-70ms | 39-43 MB |

### Why Simulation?

Real execution of compiled languages requires:
- **Judge0** API or similar backend
- **Isolated containers** for security
- **Resource limits** and monitoring
- **Multi-language compiler** infrastructure

To configure real evaluation for these languages:
```bash
# Set environment variable
NEXT_PUBLIC_JUDGE_URL=https://your-judge0-instance.com
```

---

## 3. Scoring System 🏆

**Location**: `lib/services/scoring.ts`

### Score Components

| Component | Weight | How It's Calculated |
|-----------|--------|---------------------|
| **Correctness** | 55% | `(passed / total) × 55` |
| **Runtime** | 15% | Relative performance vs opponent |
| **Memory** | 10% | Relative memory usage |
| **Speed** | 20% | How fast you submitted |

### Scoring Formula

```typescript
correctness = 55 × (passed / total)
runtime = 15 × relative(myTime, theirTime) × ratio
memory = 10 × relative(myMem, theirMem) × ratio
speed = 20 × (1 - submissionTime / totalTime) × ratio

totalScore = correctness + runtime + memory + speed
```

### Winner Decision Logic

1. **If correctness differs**: Higher correctness wins
   - Example: 8/10 tests beats 6/10 tests

2. **If equal correctness**: Compare total scores
   - Runtime, memory, and speed break the tie

3. **If scores within 0.5**: Draw
   - Too close to call

### Example Battle

```
You:
  Correctness: 55.0 (10/10 tests)
  Runtime: 15.0 (faster)
  Memory: 8.5 (used more)
  Speed: 12.0 (submitted at 60s/120s)
  Total: 90.5

Opponent:
  Correctness: 55.0 (10/10 tests)
  Runtime: 12.0 (slower)
  Memory: 10.0 (used less)
  Speed: 8.0 (submitted at 80s/120s)
  Total: 85.0

Winner: YOU
Reason: Equal correctness — decided on runtime, memory and submission time
Rating Change: +8
```

---

## 4. Test Cases

### Types of Tests

**Visible Tests** (shown on "Run"):
- Basic examples from problem statement
- User can see input/output/expected
- Help with debugging

**Hidden Tests** (only on "Submit"):
- Edge cases (empty arrays, single elements)
- Performance tests (large inputs)
- Corner cases (negatives, duplicates, max values)
- Not shown until after submission

### Test Case Execution

```typescript
// Each test case format:
{
  args: [[2, 7, 11, 15], 9],    // Function arguments
  expected: [0, 1],               // Expected output
  hidden: true                    // Shown only on submit
}

// Execution:
const output = yourFunction(...args);
if (JSON.stringify(output) === JSON.stringify(expected)) {
  status = "passed"
} else {
  status = "failed"
}
```

---

## 5. Performance Measurement

### Runtime

**JavaScript (Real)**:
```javascript
const t0 = performance.now();
const output = solve(...args);
const timeMs = performance.now() - t0;
```

**Other Languages (Simulated)**:
- Base time + random variance
- Realistic for language characteristics

### Memory

**JavaScript (Estimated)**:
```javascript
// Based on:
- Code complexity (data structures used)
- Input size
- Baseline per language
```

**Estimation Formula**:
```
memory = 38.6 + structures × 0.35 + inputSize/2048 + random
```

### Noise Floor

Small differences are ignored to avoid random jitter deciding battles:
- Runtime: ±1ms or ±15% (whichever is larger)
- Memory: ±1MB or ±15%

---

## 6. Safety & Sandboxing

### Web Worker Isolation

✅ **Protections**:
- Runs in separate thread
- No access to DOM
- No access to localStorage/cookies
- Hard timeout enforced
- Sandboxed console

❌ **Limitations**:
- Can't prevent CPU-intensive algorithms
- Memory usage not strictly limited
- Network requests blocked by worker context

### Code Safety

```javascript
// Safe execution:
const solve = new Function("console", code + "\n;return " + fn)(sandboxConsole);

// User's code never has access to:
- window object
- document
- localStorage
- fetch/XHR (blocked in workers)
- importScripts (blocked)
```

---

## 7. Integration with Backend Judge

### To Enable Real Execution for All Languages

1. **Set up Judge0** (or similar):
   ```bash
   docker run -p 2358:2358 judge0/judge0:latest
   ```

2. **Configure environment**:
   ```bash
   NEXT_PUBLIC_JUDGE_URL=http://localhost:2358
   ```

3. **Update judge.ts**:
   ```typescript
   export async function judge(code, problem, mode, language) {
     if (language === "javascript") {
       return runJavaScript(code, problem, mode);
     }
     
     // NEW: Real backend execution
     return await fetch(process.env.NEXT_PUBLIC_JUDGE_URL + '/submissions', {
       method: 'POST',
       body: JSON.stringify({
         source_code: code,
         language_id: languageIds[language],
         // ... test cases
       })
     });
   }
   ```

### Judge0 Integration Points

- **Language IDs**: 63 (JS), 71 (Python), 54 (C++), 62 (Java)
- **API endpoint**: `/submissions`
- **Polling**: Check status until completed
- **Timeout**: Configure per problem
- **Memory limit**: Set container limits

---

## 8. User Experience Flow

### Run Code (Testing)
```
1. User clicks "Run"
2. Only visible tests execute
3. Results shown immediately
4. No submission recorded
5. Can run unlimited times
```

### Submit Code (Judging)
```
1. User clicks "Submit"
2. ALL tests execute (visible + hidden)
3. Results shown after execution
4. Submission recorded in database
5. Can only submit once per battle
6. Triggers scoring and winner decision
```

### Results Display

```
✓ Test 1: PASSED (0.12ms)
  Input: nums = [2,7,11,15], target = 9
  Expected: [0,1]
  Got: [0,1]

✗ Test 2: FAILED (0.08ms)
  Input: nums = [3,2,4], target = 6
  Expected: [1,2]
  Got: [2,1]

⏱ Test 3: TIME LIMIT EXCEEDED
  Input: nums = [1,2,3,...100000], target = 200000

Verdict: Wrong Answer
Passed: 1/3 tests
Runtime: 2000.20ms
Memory: 42.1 MB
```

---

## Summary

✅ **JavaScript**: Real execution in Web Worker, accurate results
⚠️ **Python/C++/Java**: Simulated until backend judge configured
🏆 **Scoring**: 55% correctness + 15% runtime + 10% memory + 20% speed
🔒 **Security**: Web Worker sandboxing, timeouts, isolated execution
📊 **Testing**: Visible tests for development, hidden tests for validation

**Current Status**: JavaScript fully functional, other languages need Judge0 integration for real execution.
