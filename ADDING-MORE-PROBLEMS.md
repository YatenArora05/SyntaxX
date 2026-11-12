# How to Add More Problems

## Quick Template

Copy this template to add a new problem to `lib/mock-data/problems.ts`:

```typescript
  // #26 - Your Problem Title
  {
    id: "your-problem-id",
    title: "Your Problem Title",
    difficulty: "Easy", // or "Medium" or "Hard"
    topics: ["Arrays", "Hash Map"], // relevant topics
    statement: [
      "First paragraph of problem description.",
      "Additional clarifications or constraints.",
    ],
    inputFormat: "Description of inputs.",
    outputFormat: "Description of expected output.",
    constraints: ["1 ≤ n ≤ 10⁵", "other constraints"],
    samples: [
      { input: 'nums = [1,2,3]', output: "6", explanation: "Optional explanation" },
      { input: 'nums = [4,5]', output: "9" },
    ],
    functionName: "yourFunctionName",
    tests: [
      { args: [[1, 2, 3]], expected: 6 },
      { args: [[4, 5]], expected: 9 },
      { args: [[0]], expected: 0, hidden: true },
      // Add 3-5 hidden test cases
    ],
    starter: starter(
      "yourFunctionName",
      "param1, param2",
      "param1: type, param2: type",
      "returnType yourFunctionName(type param1, type param2)",
      "returnType yourFunctionName(type param1, type param2)"
    ),
    referenceSolutions: ref(
      // JavaScript
      \`function yourFunctionName(param1, param2) {
  // your solution
  return result;
}\`,
      
      // Python
      \`class Solution:
    def yourFunctionName(self, param1: type, param2: type) -> returnType:
        # your solution
        return result\`,
      
      // C++
      \`class Solution {
public:
    returnType yourFunctionName(type param1, type param2) {
        // your solution
        return result;
    }
};\`,
      
      // Java
      \`class Solution {
    public returnType yourFunctionName(type param1, type param2) {
        // your solution
        return result;
    }
}\`
    ),
    timeLimitMs: 1000, // adjust as needed
    acceptance: 50.0, // estimated acceptance rate
  },
```

## Step-by-Step Guide

### 1. Choose a Problem

Pick a problem that:
- Fits your difficulty target (aim for 60% Easy, 30% Medium, 10% Hard)
- Covers different algorithmic concepts
- Has clear inputs/outputs
- Can be solved in multiple languages

### 2. Write the Problem Statement

- Keep it concise and clear
- Provide 2-3 examples
- Specify all constraints
- Clarify edge cases

### 3. Create Test Cases

**Visible Tests** (2-3):
- Basic examples from problem statement
- Shows expected behavior

**Hidden Tests** (3-5):
- Edge cases (empty, single element, max size)
- Corner cases (negatives, zeros, duplicates)
- Performance tests (large inputs)

### 4. Write Solutions in All 4 Languages

**Tips:**
- Start with the language you're most comfortable with
- Keep solutions readable and efficient
- Use idiomatic patterns for each language
- Test each solution before adding

**Language-Specific Notes:**

**JavaScript:**
```javascript
// Use modern syntax: const, arrow functions, spread
// Common methods: map, filter, reduce, sort
// Collections: Map, Set
```

**Python:**
```python
# Use class Solution with self
# Type hints: def func(self, x: int) -> int
# Collections: dict, set, list comprehensions
```

**C++:**
```cpp
// Include: #include <bits/stdc++.h>
// Namespace: using namespace std;
// STL: vector, unordered_map, unordered_set
```

**Java:**
```java
// Import: import java.util.*;
// Collections: HashMap, HashSet, ArrayList
// Array conversion: Arrays.asList(), toArray()
```

### 5. Test Your Solutions

Before adding to the file:

1. **Run locally** in each language
2. **Verify test cases** pass
3. **Check edge cases**
4. **Ensure consistency** across languages

### 6. Add to problems.ts

1. Open `lib/mock-data/problems.ts`
2. Add your problem to the appropriate section
3. Update the comment number
4. Save the file

### 7. Seed the Database

```bash
npm run typecheck    # Verify no type errors
npm run db:seed      # Update database
```

### 8. Verify

```bash
npm run dev          # Start server
```

Navigate to the practice/battle page and verify your problem appears.

## Common Patterns

### Array Problems
```typescript
topics: ["Arrays", "Two Pointers"] // or "Sliding Window", "Dynamic Programming"
```

### String Problems
```typescript
topics: ["Strings", "Hash Map"] // or "Two Pointers", "Dynamic Programming"
```

### Tree Problems
```typescript
topics: ["Trees", "Depth-First Search"] // or "Breadth-First Search", "Recursion"
```

### Graph Problems
```typescript
topics: ["Graphs", "BFS"] // or "DFS", "Union Find"
```

## Difficulty Guidelines

### Easy (60% of problems)
- Single algorithmic concept
- Straightforward implementation
- Time limit: 1000ms
- Acceptance: 65-85%

### Medium (30% of problems)
- Multiple concepts or optimization needed
- Moderate complexity
- Time limit: 1000-2000ms
- Acceptance: 35-55%

### Hard (10% of problems)
- Advanced algorithms or multiple optimizations
- Complex implementation
- Time limit: 1500-3000ms
- Acceptance: 20-35%

## Example: Complete Problem Addition

See problem #2 (Reverse String) in `problems.ts` for a simple, well-documented example.
See problem #21 (Three Sum) for a more complex example with multiple edge cases.

## Need Help?

- Review existing problems in `problems.ts` for patterns
- Check the `ref()` and `starter()` helper functions
- Ensure test cases cover all edge cases
- Test locally before seeding

---

**Remember**: Quality over quantity! One well-tested problem is worth more than five buggy ones.
