# Solution Evaluation - Quick Reference

## 🎯 How Your Code Gets Judged

### JavaScript ✅ REAL EXECUTION
```
Your Code → Web Worker → Test Cases → Real Results
                ↓
         Sandboxed, Timed
              ↓
    Actual Runtime & Output
```

**What Happens:**
1. Code runs in isolated worker thread
2. Each test case executes with real inputs
3. Output compared to expected
4. Runtime measured with `performance.now()`
5. Timeout: 2× problem time limit

**Result:** ✅ **Accurate** - Real execution results

---

### Python, C++, Java ⚠️ SIMULATED
```
Your Code → Basic Check → Simulated Results
               ↓
         (no execution)
               ↓
         Estimated Pass/Fail
```

**What Happens:**
1. Code analyzed for structure
2. Results simulated based on code quality
3. Realistic but **not accurate**
4. Flagged as `executed: false`

**Result:** ⚠️ **Placeholder** - Need Judge0 backend for real execution

---

## 🏆 Scoring Breakdown

```
Total Score = 100 points

Correctness ████████████████████████████ 55 points
Runtime     █████████ 15 points
Memory      ██████ 10 points
Speed       ████████████ 20 points
```

### Example Score

| Component | You | Opponent |
|-----------|-----|----------|
| **Correctness** | 55.0 (10/10) | 55.0 (10/10) |
| **Runtime** | 15.0 (faster) | 12.0 (slower) |
| **Memory** | 8.5 (more) | 10.0 (less) |
| **Speed** | 12.0 (60s) | 8.0 (80s) |
| **TOTAL** | **90.5** ✓ | **85.0** |

**Winner:** YOU (+8 rating)

---

## 📝 Test Cases

### Run Code (Visible Tests Only)
```
✓ Test 1: [2,7,11,15], 9 → [0,1]
✓ Test 2: [3,2,4], 6 → [1,2]

Hidden tests not shown
```

### Submit Code (All Tests)
```
✓ Test 1: [2,7,11,15], 9 → [0,1]
✓ Test 2: [3,2,4], 6 → [1,2]
✓ Test 3: [3,3], 6 → [0,1]          (HIDDEN)
✓ Test 4: [-1,-2,-3,-4,-5], -8 → [2,4]  (HIDDEN)
✗ Test 5: [0,4,3,0], 0 → [0,3]      (HIDDEN - FAILED)
```

---

## ⚡ Verdict Types

| Verdict | Icon | Meaning |
|---------|------|---------|
| **Accepted** | ✅ | All tests passed |
| **Wrong Answer** | ❌ | Output doesn't match |
| **Runtime Error** | 💥 | Code threw exception |
| **Compilation Error** | 🔴 | Syntax error |
| **Time Limit Exceeded** | ⏱️ | Too slow (timeout) |

---

## 🔒 What's Sandboxed (JavaScript)

### ✅ Allowed
- Your function logic
- `console.log()` (captured)
- Math operations
- Array/String/Object operations
- Map, Set, etc.

### ❌ Blocked
- DOM access (no `document`, `window`)
- Network requests (no `fetch`)
- LocalStorage/Cookies
- File system
- Timers (setTimeout, setInterval)

---

## 🎮 Battle Flow

```
1. START
   ↓
2. Write Code & Test (unlimited)
   ↓
3. Submit (once per battle)
   ↓
4. Judge Executes All Tests
   ↓
5. Calculate Scores
   ↓
6. Compare Scores
   ↓
7. Declare Winner
   ↓
8. Update Rating
```

**Time Matters!** Submitting faster gives you speed points (up to 20).

---

## 🚀 Quick Tips

### Maximize Your Score

1. **Correctness First** (55%)
   - Pass all test cases
   - Handle edge cases

2. **Write Efficient Code** (15%)
   - O(n) beats O(n²)
   - Use appropriate data structures

3. **Optimize Memory** (10%)
   - Minimize extra space
   - Reuse variables when possible

4. **Submit Fast** (20%)
   - Don't overthink
   - Submit when tests pass

### Common Mistakes

❌ **Infinite loops** → Time Limit Exceeded
❌ **Wrong function name** → Compilation Error  
❌ **Forgetting edge cases** → Wrong Answer on hidden tests
❌ **Over-optimizing** → Wasting time, losing speed points

---

## 📊 Language Comparison

| Language | Real Execution | Typical Runtime | Memory |
|----------|----------------|-----------------|--------|
| **JavaScript** | ✅ YES | 40-70ms | 39-43 MB |
| **Python** | ⚠️ Simulated | 88-118ms | 17-21 MB |
| **C++** | ⚠️ Simulated | 12-42ms | 9-13 MB |
| **Java** | ⚠️ Simulated | 64-94ms | 44-48 MB |

*To enable real execution for all languages, configure Judge0 backend*

---

## 🎯 When Results Don't Match Expected

### JavaScript (Real)
If your code fails tests:
1. Check console output
2. Test with sample inputs manually
3. Look for edge cases
4. Verify function name matches problem

### Other Languages (Simulated)
If simulated results seem wrong:
- **Remember:** Results are not real
- **Focus on:** Algorithm correctness
- **Wait for:** Backend judge integration

---

## 💡 Need More Details?

See `SOLUTION-EVALUATION.md` for the complete technical explanation.
