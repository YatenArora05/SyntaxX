import type { Problem } from "@/types";

// Helper: build starter templates for all 4 languages
const starter = (
  fn: string,
  params: string,
  pyParams: string,
  cppSig: string,
  javaSig: string,
): Problem["starter"] => ({
  javascript: `/**\n * Write your solution below.\n * Use console.log() to debug — output appears in the console.\n */\nfunction ${fn}(${params}) {\n  \n}\n`,
  python: `class Solution:\n    def ${fn}(self, ${pyParams}):\n        pass\n`,
  cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    ${cppSig} {\n        \n    }\n};\n`,
  java: `import java.util.*;\n\nclass Solution {\n    public ${javaSig} {\n        \n    }\n}\n`,
});

// Helper: build reference solutions for all 4 languages
const ref = (js: string, py: string, cpp: string, java: string) => ({
  javascript: js,
  python: py,
  cpp: cpp,
  java: java,
});

/**
 * 25 High-Quality Coding Problems
 * Distribution: 15 Easy, 7 Medium, 3 Hard
 */
export const problems: Problem[] = [
  
  // ==================== EASY PROBLEMS (1-15) ====================

  // #1 - Pair With Target Sum
  {
    id: "pair-sum",
    title: "Pair With Target Sum",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Map"],
    statement: [
      "You are given an array of integers `nums` and an integer `target`.",
      "Return the indices of the two numbers that add up to `target`, as an array `[i, j]` with `i < j`.",
      "Exactly one valid answer exists, and you may not use the same element twice.",
    ],
    inputFormat: "An integer array `nums` and an integer `target`.",
    outputFormat: "An array of two indices `[i, j]` where `i < j`.",
    constraints: ["2 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹", "Exactly one valid answer exists"],
    samples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 9." },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
    ],
    functionName: "pairSum",
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1], hidden: true },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], hidden: true },
      { args: [[0, 4, 3, 0], 0], expected: [0, 3], hidden: true },
      { args: [[1, 5, 9, 14, 20, 33], 47], expected: [3, 5], hidden: true },
    ],
    starter: starter("pairSum", "nums, target", "nums: list[int], target: int", "vector<int> pairSum(vector<int>& nums, int target)", "int[] pairSum(int[] nums, int target)"),
    referenceSolutions: ref(
      // JavaScript
      `function pairSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (seen.has(need)) return [seen.get(need), i];
    seen.set(nums[i], i);
  }
  return [];
}`,
      // Python
      `class Solution:
    def pairSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, n in enumerate(nums):
            need = target - n
            if need in seen:
                return [seen[need], i]
            seen[n] = i
        return []`,
      // C++
      `class Solution {
public:
    vector<int> pairSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int need = target - nums[i];
            if (seen.count(need)) return {seen[need], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      // Java
      `class Solution {
    public int[] pairSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) return new int[]{seen.get(need), i};
            seen.put(nums[i], i);
        }
        return new int[]{};
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 61.4,
  },

  // #2 - Reverse String
  {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    topics: ["Strings", "Two Pointers"],
    statement: [
      "Given a string `s`, return the string reversed.",
      "For example, if the input is `'hello'`, return `'olleh'`.",
    ],
    inputFormat: "A single string `s`.",
    outputFormat: "A string: the reversed input.",
    constraints: ["0 ≤ s.length ≤ 10⁴"],
    samples: [
      { input: 's = "hello"', output: '"olleh"' },
      { input: 's = "world"', output: '"dlrow"' },
    ],
    functionName: "reverseString",
    tests: [
      { args: ["hello"], expected: "olleh" },
      { args: ["world"], expected: "dlrow" },
      { args: [""], expected: "", hidden: true },
      { args: ["a"], expected: "a", hidden: true },
      { args: ["racecar"], expected: "racecar", hidden: true },
    ],
    starter: starter("reverseString", "s", "s: str", "string reverseString(string s)", "String reverseString(String s)"),
    referenceSolutions: ref(
      `function reverseString(s) {
  return s.split('').reverse().join('');
}`,
      `class Solution:
    def reverseString(self, s: str) -> str:
        return s[::-1]`,
      `class Solution {
public:
    string reverseString(string s) {
        reverse(s.begin(), s.end());
        return s;
    }
};`,
      `class Solution {
    public String reverseString(String s) {
        return new StringBuilder(s).reverse().toString();
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 78.2,
  },

  // #3 - Is Palindrome
  {
    id: "is-palindrome",
    title: "Check Palindrome",
    difficulty: "Easy",
    topics: ["Strings", "Two Pointers"],
    statement: [
      "Determine if a string `s` reads the same forward and backward.",
      "The comparison is case-sensitive.",
    ],
    inputFormat: "A string `s`.",
    outputFormat: "Boolean: true if palindrome, false otherwise.",
    constraints: ["0 ≤ s.length ≤ 10⁴"],
    samples: [
      { input: 's = "racecar"', output: "true" },
      { input: 's = "hello"', output: "false" },
    ],
    functionName: "isPalindrome",
    tests: [
      { args: ["racecar"], expected: true },
      { args: ["hello"], expected: false },
      { args: [""], expected: true, hidden: true },
      { args: ["a"], expected: true, hidden: true },
      { args: ["abba"], expected: true, hidden: true },
      { args: ["Racecar"], expected: false, hidden: true },
    ],
    starter: starter("isPalindrome", "s", "s: str", "bool isPalindrome(string s)", "boolean isPalindrome(String s)"),
    referenceSolutions: ref(
      `function isPalindrome(s) {
  return s === s.split('').reverse().join('');
}`,
      `class Solution:
    def isPalindrome(self, s: str) -> bool:
        return s == s[::-1]`,
      `class Solution {
public:
    bool isPalindrome(string s) {
        string rev = s;
        reverse(rev.begin(), rev.end());
        return s == rev;
    }
};`,
      `class Solution {
    public boolean isPalindrome(String s) {
        return s.equals(new StringBuilder(s).reverse().toString());
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 74.1,
  },

  // #4 - Find Maximum
  {
    id: "find-max",
    title: "Find Maximum in Array",
    difficulty: "Easy",
    topics: ["Arrays"],
    statement: [
      "Given an array of integers `nums`, return the maximum value.",
      "The array will contain at least one element.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "An integer: the maximum value in the array.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹"],
    samples: [
      { input: "nums = [3,1,4,1,5,9]", output: "9" },
      { input: "nums = [-5,-2,-8]", output: "-2" },
    ],
    functionName: "findMax",
    tests: [
      { args: [[3, 1, 4, 1, 5, 9]], expected: 9 },
      { args: [[-5, -2, -8]], expected: -2 },
      { args: [[42]], expected: 42, hidden: true },
      { args: [[0, 0, 0, 1]], expected: 1, hidden: true },
      { args: [[1000000000, -1000000000]], expected: 1000000000, hidden: true },
    ],
    starter: starter("findMax", "nums", "nums: list[int]", "int findMax(vector<int>& nums)", "int findMax(int[] nums)"),
    referenceSolutions: ref(
      `function findMax(nums) {
  return Math.max(...nums);
}`,
      `class Solution:
    def findMax(self, nums: list[int]) -> int:
        return max(nums)`,
      `class Solution {
public:
    int findMax(vector<int>& nums) {
        return *max_element(nums.begin(), nums.end());
    }
};`,
      `class Solution {
    public int findMax(int[] nums) {
        int max = nums[0];
        for (int n : nums) {
            if (n > max) max = n;
        }
        return max;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 82.5,
  },

  // #5 - Count Vowels
  {
    id: "count-vowels",
    title: "Count Vowels",
    difficulty: "Easy",
    topics: ["Strings"],
    statement: [
      "Given a string `s`, count the number of vowels (a, e, i, o, u).",
      "Count both lowercase and uppercase vowels.",
    ],
    inputFormat: "A string `s`.",
    outputFormat: "An integer: the count of vowels.",
    constraints: ["0 ≤ s.length ≤ 10⁴"],
    samples: [
      { input: 's = "hello"', output: "2" },
      { input: 's = "Programming"', output: "3" },
    ],
    functionName: "countVowels",
    tests: [
      { args: ["hello"], expected: 2 },
      { args: ["Programming"], expected: 3 },
      { args: [""], expected: 0, hidden: true },
      { args: ["bcdfg"], expected: 0, hidden: true },
      { args: ["aeiouAEIOU"], expected: 10, hidden: true },
    ],
    starter: starter("countVowels", "s", "s: str", "int countVowels(string s)", "int countVowels(String s)"),
    referenceSolutions: ref(
      `function countVowels(s) {
  const vowels = 'aeiouAEIOU';
  return [...s].filter(c => vowels.includes(c)).length;
}`,
      `class Solution:
    def countVowels(self, s: str) -> int:
        return sum(1 for c in s if c in 'aeiouAEIOU')`,
      `class Solution {
public:
    int countVowels(string s) {
        string vowels = "aeiouAEIOU";
        int count = 0;
        for (char c : s) {
            if (vowels.find(c) != string::npos) count++;
        }
        return count;
    }
};`,
      `class Solution {
    public int countVowels(String s) {
        String vowels = "aeiouAEIOU";
        int count = 0;
        for (char c : s.toCharArray()) {
            if (vowels.indexOf(c) != -1) count++;
        }
        return count;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 79.3,
  },

  // #6 - Sum Array
  {
    id: "sum-array",
    title: "Sum of Array Elements",
    difficulty: "Easy",
    topics: ["Arrays"],
    statement: [
      "Given an array of integers `nums`, return the sum of all elements.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "An integer: the sum of all elements.",
    constraints: ["0 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹"],
    samples: [
      { input: "nums = [1,2,3,4]", output: "10" },
      { input: "nums = [-1,1,-2,2]", output: "0" },
    ],
    functionName: "sumArray",
    tests: [
      { args: [[1, 2, 3, 4]], expected: 10 },
      { args: [[-1, 1, -2, 2]], expected: 0 },
      { args: [[]], expected: 0, hidden: true },
      { args: [[100]], expected: 100, hidden: true },
      { args: [[5, -5, 10, -10]], expected: 0, hidden: true },
    ],
    starter: starter("sumArray", "nums", "nums: list[int]", "int sumArray(vector<int>& nums)", "int sumArray(int[] nums)"),
    referenceSolutions: ref(
      `function sumArray(nums) {
  return nums.reduce((a, b) => a + b, 0);
}`,
      `class Solution:
    def sumArray(self, nums: list[int]) -> int:
        return sum(nums)`,
      `class Solution {
public:
    int sumArray(vector<int>& nums) {
        return accumulate(nums.begin(), nums.end(), 0);
    }
};`,
      `class Solution {
    public int sumArray(int[] nums) {
        int sum = 0;
        for (int n : nums) sum += n;
        return sum;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 85.7,
  },

  // #7 - Contains Duplicate
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Map"],
    statement: [
      "Given an integer array `nums`, return `true` if any value appears at least twice.",
      "Return `false` if every element is distinct.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "Boolean: true if duplicate exists, false otherwise.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹"],
    samples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" },
    ],
    functionName: "containsDuplicate",
    tests: [
      { args: [[1, 2, 3, 1]], expected: true },
      { args: [[1, 2, 3, 4]], expected: false },
      { args: [[1]], expected: false, hidden: true },
      { args: [[1, 1]], expected: true, hidden: true },
      { args: [[0, 0, 0]], expected: true, hidden: true },
    ],
    starter: starter("containsDuplicate", "nums", "nums: list[int]", "bool containsDuplicate(vector<int>& nums)", "boolean containsDuplicate(int[] nums)"),
    referenceSolutions: ref(
      `function containsDuplicate(nums) {
  return new Set(nums).size !== nums.length;
}`,
      `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        return len(set(nums)) != len(nums)`,
      `class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        unordered_set<int> seen;
        for (int n : nums) {
            if (seen.count(n)) return true;
            seen.insert(n);
        }
        return false;
    }
};`,
      `class Solution {
    public boolean containsDuplicate(int[] nums) {
        Set<Integer> seen = new HashSet<>();
        for (int n : nums) {
            if (!seen.add(n)) return true;
        }
        return false;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 71.8,
  },

  // #8 - Fizz Buzz
  {
    id: "fizz-buzz",
    title: "Fizz Buzz",
    difficulty: "Easy",
    topics: ["Arrays"],
    statement: [
      "Given an integer `n`, return an array of strings where:",
      "- For multiples of 3, add `'Fizz'`",
      "- For multiples of 5, add `'Buzz'`",
      "- For multiples of both 3 and 5, add `'FizzBuzz'`",
      "- Otherwise, add the number as a string",
      "The array should contain entries from 1 to n (inclusive).",
    ],
    inputFormat: "An integer `n`.",
    outputFormat: "An array of strings of length n.",
    constraints: ["1 ≤ n ≤ 10⁴"],
    samples: [
      { input: "n = 5", output: '["1","2","Fizz","4","Buzz"]' },
      { input: "n = 15", output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' },
    ],
    functionName: "fizzBuzz",
    tests: [
      { args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
      { args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
      { args: [1], expected: ["1"], hidden: true },
      { args: [3], expected: ["1", "2", "Fizz"], hidden: true },
    ],
    starter: starter("fizzBuzz", "n", "n: int", "vector<string> fizzBuzz(int n)", "String[] fizzBuzz(int n)"),
    referenceSolutions: ref(
      `function fizzBuzz(n) {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) result.push('FizzBuzz');
    else if (i % 3 === 0) result.push('Fizz');
    else if (i % 5 === 0) result.push('Buzz');
    else result.push(String(i));
  }
  return result;
}`,
      `class Solution:
    def fizzBuzz(self, n: int) -> list[str]:
        result = []
        for i in range(1, n + 1):
            if i % 15 == 0:
                result.append('FizzBuzz')
            elif i % 3 == 0:
                result.append('Fizz')
            elif i % 5 == 0:
                result.append('Buzz')
            else:
                result.append(str(i))
        return result`,
      `class Solution {
public:
    vector<string> fizzBuzz(int n) {
        vector<string> result;
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) result.push_back("FizzBuzz");
            else if (i % 3 == 0) result.push_back("Fizz");
            else if (i % 5 == 0) result.push_back("Buzz");
            else result.push_back(to_string(i));
        }
        return result;
    }
};`,
      `class Solution {
    public String[] fizzBuzz(int n) {
        String[] result = new String[n];
        for (int i = 1; i <= n; i++) {
            if (i % 15 == 0) result[i-1] = "FizzBuzz";
            else if (i % 3 == 0) result[i-1] = "Fizz";
            else if (i % 5 == 0) result[i-1] = "Buzz";
            else result[i-1] = String.valueOf(i);
        }
        return result;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 76.9,
  },

  // #9 - Remove Duplicates from Sorted Array
  {
    id: "remove-duplicates",
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    topics: ["Arrays", "Two Pointers"],
    statement: [
      "Given a sorted array `nums`, remove duplicates in-place and return the new length.",
      "The first `k` elements should contain the unique elements in their original order.",
      "It doesn't matter what you leave beyond the new length.",
    ],
    inputFormat: "A sorted integer array `nums`.",
    outputFormat: "An integer: the number of unique elements.",
    constraints: ["0 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹", "nums is sorted in ascending order"],
    samples: [
      { input: "nums = [1,1,2]", output: "2", explanation: "First 2 elements become [1,2]" },
      { input: "nums = [0,0,1,1,2,2,3]", output: "4", explanation: "First 4 elements become [0,1,2,3]" },
    ],
    functionName: "removeDuplicates",
    tests: [
      { args: [[1, 1, 2]], expected: 2 },
      { args: [[0, 0, 1, 1, 2, 2, 3]], expected: 4 },
      { args: [[]], expected: 0, hidden: true },
      { args: [[1]], expected: 1, hidden: true },
      { args: [[1, 2, 3]], expected: 3, hidden: true },
    ],
    starter: starter("removeDuplicates", "nums", "nums: list[int]", "int removeDuplicates(vector<int>& nums)", "int removeDuplicates(int[] nums)"),
    referenceSolutions: ref(
      `function removeDuplicates(nums) {
  if (nums.length === 0) return 0;
  let k = 1;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] !== nums[i - 1]) {
      nums[k++] = nums[i];
    }
  }
  return k;
}`,
      `class Solution:
    def removeDuplicates(self, nums: list[int]) -> int:
        if not nums:
            return 0
        k = 1
        for i in range(1, len(nums)):
            if nums[i] != nums[i - 1]:
                nums[k] = nums[i]
                k += 1
        return k`,
      `class Solution {
public:
    int removeDuplicates(vector<int>& nums) {
        if (nums.empty()) return 0;
        int k = 1;
        for (int i = 1; i < nums.size(); i++) {
            if (nums[i] != nums[i - 1]) {
                nums[k++] = nums[i];
            }
        }
        return k;
    }
};`,
      `class Solution {
    public int removeDuplicates(int[] nums) {
        if (nums.length == 0) return 0;
        int k = 1;
        for (int i = 1; i < nums.length; i++) {
            if (nums[i] != nums[i - 1]) {
                nums[k++] = nums[i];
            }
        }
        return k;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 68.4,
  },

  // #10 - Valid Anagram
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    topics: ["Strings", "Hash Map"],
    statement: [
      "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`.",
      "An anagram is formed by rearranging the letters of a word.",
    ],
    inputFormat: "Two strings `s` and `t`.",
    outputFormat: "Boolean: true if t is an anagram of s.",
    constraints: ["1 ≤ s.length, t.length ≤ 10⁴", "s and t consist of lowercase English letters"],
    samples: [
      { input: 's = "anagram", t = "nagaram"', output: "true" },
      { input: 's = "rat", t = "car"', output: "false" },
    ],
    functionName: "isAnagram",
    tests: [
      { args: ["anagram", "nagaram"], expected: true },
      { args: ["rat", "car"], expected: false },
      { args: ["a", "a"], expected: true, hidden: true },
      { args: ["ab", "ba"], expected: true, hidden: true },
      { args: ["abc", "abcd"], expected: false, hidden: true },
    ],
    starter: starter("isAnagram", "s, t", "s: str, t: str", "bool isAnagram(string s, string t)", "boolean isAnagram(String s, String t)"),
    referenceSolutions: ref(
      `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    if (!count[c]) return false;
    count[c]--;
  }
  return true;
}`,
      `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        count = {}
        for c in s:
            count[c] = count.get(c, 0) + 1
        for c in t:
            if c not in count or count[c] == 0:
                return False
            count[c] -= 1
        return True`,
      `class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;
        unordered_map<char, int> count;
        for (char c : s) count[c]++;
        for (char c : t) {
            if (--count[c] < 0) return false;
        }
        return true;
    }
};`,
      `class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        Map<Character, Integer> count = new HashMap<>();
        for (char c : s.toCharArray()) {
            count.put(c, count.getOrDefault(c, 0) + 1);
        }
        for (char c : t.toCharArray()) {
            if (!count.containsKey(c) || count.get(c) == 0) return false;
            count.put(c, count.get(c) - 1);
        }
        return true;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 66.2,
  },

  // #11 - Move Zeroes
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    topics: ["Arrays", "Two Pointers"],
    statement: [
      "Given an integer array `nums`, move all zeros to the end while maintaining the relative order of non-zero elements.",
      "You must do this in-place without making a copy of the array.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "The array modified in-place (return the count of non-zero elements).",
    constraints: ["1 ≤ nums.length ≤ 10⁴", "−2³¹ ≤ nums[i] ≤ 2³¹ − 1"],
    samples: [
      { input: "nums = [0,1,0,3,12]", output: "3", explanation: "Array becomes [1,3,12,0,0]" },
      { input: "nums = [0]", output: "0" },
    ],
    functionName: "moveZeroes",
    tests: [
      { args: [[0, 1, 0, 3, 12]], expected: 3 },
      { args: [[0]], expected: 0 },
      { args: [[1]], expected: 1, hidden: true },
      { args: [[1, 2, 3]], expected: 3, hidden: true },
      { args: [[0, 0, 1]], expected: 1, hidden: true },
    ],
    starter: starter("moveZeroes", "nums", "nums: list[int]", "int moveZeroes(vector<int>& nums)", "int moveZeroes(int[] nums)"),
    referenceSolutions: ref(
      `function moveZeroes(nums) {
  let pos = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== 0) {
      nums[pos++] = nums[i];
    }
  }
  while (pos < nums.length) {
    nums[pos++] = 0;
  }
  return nums.filter(x => x !== 0).length;
}`,
      `class Solution:
    def moveZeroes(self, nums: list[int]) -> int:
        pos = 0
        for i in range(len(nums)):
            if nums[i] != 0:
                nums[pos] = nums[i]
                pos += 1
        while pos < len(nums):
            nums[pos] = 0
            pos += 1
        return sum(1 for x in nums if x != 0)`,
      `class Solution {
public:
    int moveZeroes(vector<int>& nums) {
        int pos = 0;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] != 0) {
                nums[pos++] = nums[i];
            }
        }
        while (pos < nums.size()) {
            nums[pos++] = 0;
        }
        return count_if(nums.begin(), nums.end(), [](int x) { return x != 0; });
    }
};`,
      `class Solution {
    public int moveZeroes(int[] nums) {
        int pos = 0;
        for (int i = 0; i < nums.length; i++) {
            if (nums[i] != 0) {
                nums[pos++] = nums[i];
            }
        }
        while (pos < nums.length) {
            nums[pos++] = 0;
        }
        int count = 0;
        for (int n : nums) if (n != 0) count++;
        return count;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 70.5,
  },

  // #12 - Best Time to Buy and Sell Stock
  {
    id: "best-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    topics: ["Arrays", "Dynamic Programming"],
    statement: [
      "You are given an array `prices` where `prices[i]` is the price of a stock on day i.",
      "Find the maximum profit you can achieve by buying on one day and selling on a later day.",
      "If no profit is possible, return 0.",
    ],
    inputFormat: "An integer array `prices`.",
    outputFormat: "An integer: the maximum profit.",
    constraints: ["1 ≤ prices.length ≤ 10⁵", "0 ≤ prices[i] ≤ 10⁴"],
    samples: [
      { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price=1), sell on day 5 (price=6), profit=5" },
      { input: "prices = [7,6,4,3,1]", output: "0", explanation: "Prices only decrease, no profit possible" },
    ],
    functionName: "maxProfit",
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5 },
      { args: [[7, 6, 4, 3, 1]], expected: 0 },
      { args: [[1, 2]], expected: 1, hidden: true },
      { args: [[2, 1]], expected: 0, hidden: true },
      { args: [[3, 3, 3]], expected: 0, hidden: true },
    ],
    starter: starter("maxProfit", "prices", "prices: list[int]", "int maxProfit(vector<int>& prices)", "int maxProfit(int[] prices)"),
    referenceSolutions: ref(
      `function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;
  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }
  return maxProfit;
}`,
      `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            min_price = min(min_price, price)
            max_profit = max(max_profit, price - min_price)
        return max_profit`,
      `class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
};`,
      `class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }
        return maxProfit;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 64.8,
  },

  // #13 - Single Number
  {
    id: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    topics: ["Arrays", "Bit Manipulation"],
    statement: [
      "Given a non-empty array `nums` where every element appears twice except for one.",
      "Find that single element that appears only once.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "An integer: the element that appears once.",
    constraints: ["1 ≤ nums.length ≤ 10⁵", "−3×10⁴ ≤ nums[i] ≤ 3×10⁴", "Every element appears twice except one"],
    samples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" },
    ],
    functionName: "singleNumber",
    tests: [
      { args: [[2, 2, 1]], expected: 1 },
      { args: [[4, 1, 2, 1, 2]], expected: 4 },
      { args: [[1]], expected: 1, hidden: true },
      { args: [[7, 3, 5, 3, 7]], expected: 5, hidden: true },
    ],
    starter: starter("singleNumber", "nums", "nums: list[int]", "int singleNumber(vector<int>& nums)", "int singleNumber(int[] nums)"),
    referenceSolutions: ref(
      `function singleNumber(nums) {
  let result = 0;
  for (const n of nums) {
    result ^= n;
  }
  return result;
}`,
      `class Solution:
    def singleNumber(self, nums: list[int]) -> int:
        result = 0
        for n in nums:
            result ^= n
        return result`,
      `class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int result = 0;
        for (int n : nums) {
            result ^= n;
        }
        return result;
    }
};`,
      `class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int n : nums) {
            result ^= n;
        }
        return result;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 73.6,
  },

  // #14 - Intersection of Two Arrays
  {
    id: "array-intersection",
    title: "Intersection of Two Arrays",
    difficulty: "Easy",
    topics: ["Arrays", "Hash Map"],
    statement: [
      "Given two integer arrays `nums1` and `nums2`, return an array of their intersection.",
      "Each element in the result must be unique, and the order doesn't matter.",
    ],
    inputFormat: "Two integer arrays `nums1` and `nums2`.",
    outputFormat: "An array of unique integers present in both arrays.",
    constraints: ["1 ≤ nums1.length, nums2.length ≤ 1000", "0 ≤ nums1[i], nums2[i] ≤ 1000"],
    samples: [
      { input: "nums1 = [1,2,2,1], nums2 = [2,2]", output: "[2]" },
      { input: "nums1 = [4,9,5], nums2 = [9,4,9,8,4]", output: "[9,4]" },
    ],
    functionName: "intersection",
    tests: [
      { args: [[1, 2, 2, 1], [2, 2]], expected: [2] },
      { args: [[4, 9, 5], [9, 4, 9, 8, 4]], expected: [4, 9] },
      { args: [[1], [1]], expected: [1], hidden: true },
      { args: [[1, 2], [3, 4]], expected: [], hidden: true },
    ],
    starter: starter("intersection", "nums1, nums2", "nums1: list[int], nums2: list[int]", "vector<int> intersection(vector<int>& nums1, vector<int>& nums2)", "int[] intersection(int[] nums1, int[] nums2)"),
    referenceSolutions: ref(
      `function intersection(nums1, nums2) {
  const set1 = new Set(nums1);
  const set2 = new Set(nums2);
  return [...set1].filter(n => set2.has(n));
}`,
      `class Solution:
    def intersection(self, nums1: list[int], nums2: list[int]) -> list[int]:
        return list(set(nums1) & set(nums2))`,
      `class Solution {
public:
    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {
        unordered_set<int> set1(nums1.begin(), nums1.end());
        unordered_set<int> set2(nums2.begin(), nums2.end());
        vector<int> result;
        for (int n : set1) {
            if (set2.count(n)) result.push_back(n);
        }
        return result;
    }
};`,
      `class Solution {
    public int[] intersection(int[] nums1, int[] nums2) {
        Set<Integer> set1 = new HashSet<>();
        Set<Integer> set2 = new HashSet<>();
        for (int n : nums1) set1.add(n);
        for (int n : nums2) set2.add(n);
        set1.retainAll(set2);
        return set1.stream().mapToInt(Integer::intValue).toArray();
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 75.3,
  },

  // #15 - Missing Number
  {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    topics: ["Arrays", "Math"],
    statement: [
      "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`.",
      "Return the only number in the range that is missing from the array.",
    ],
    inputFormat: "An integer array `nums` of length n.",
    outputFormat: "An integer: the missing number.",
    constraints: ["1 ≤ n ≤ 10⁴", "nums.length == n", "0 ≤ nums[i] ≤ n", "All numbers are unique"],
    samples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" },
      { input: "nums = [9,6,4,2,3,5,7,0,1]", output: "8" },
    ],
    functionName: "missingNumber",
    tests: [
      { args: [[3, 0, 1]], expected: 2 },
      { args: [[0, 1]], expected: 2 },
      { args: [[9, 6, 4, 2, 3, 5, 7, 0, 1]], expected: 8 },
      { args: [[0]], expected: 1, hidden: true },
      { args: [[1]], expected: 0, hidden: true },
    ],
    starter: starter("missingNumber", "nums", "nums: list[int]", "int missingNumber(vector<int>& nums)", "int missingNumber(int[] nums)"),
    referenceSolutions: ref(
      `function missingNumber(nums) {
  const n = nums.length;
  const expectedSum = (n * (n + 1)) / 2;
  const actualSum = nums.reduce((a, b) => a + b, 0);
  return expectedSum - actualSum;
}`,
      `class Solution:
    def missingNumber(self, nums: list[int]) -> int:
        n = len(nums)
        expected_sum = n * (n + 1) // 2
        actual_sum = sum(nums)
        return expected_sum - actual_sum`,
      `class Solution {
public:
    int missingNumber(vector<int>& nums) {
        int n = nums.size();
        int expectedSum = n * (n + 1) / 2;
        int actualSum = accumulate(nums.begin(), nums.end(), 0);
        return expectedSum - actualSum;
    }
};`,
      `class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int expectedSum = n * (n + 1) / 2;
        int actualSum = 0;
        for (int num : nums) actualSum += num;
        return expectedSum - actualSum;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 69.7,
  },

  // ==================== MEDIUM PROBLEMS (16-22) ====================

  // #16 - Longest Unique Run
  {
    id: "longest-unique-run",
    title: "Longest Unique Run",
    difficulty: "Medium",
    topics: ["Strings", "Sliding Window"],
    statement: [
      "Given a string `s`, find the length of the longest contiguous substring in which no character repeats.",
      "A substring is a contiguous block of characters — `\"pwke\"` is a subsequence of `\"pwwkew\"`, not a substring.",
    ],
    inputFormat: "A single string `s` consisting of printable ASCII characters.",
    outputFormat: "An integer: the length of the longest substring without repeated characters.",
    constraints: ["0 ≤ s.length ≤ 5×10⁴", "s consists of letters, digits, symbols and spaces"],
    samples: [
      { input: 's = "abcabcbb"', output: "3", explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "pwwkew"', output: "3", explanation: 'The answer is "wke".' },
    ],
    functionName: "longestUniqueRun",
    tests: [
      { args: ["abcabcbb"], expected: 3 },
      { args: ["pwwkew"], expected: 3 },
      { args: ["bbbbb"], expected: 1, hidden: true },
      { args: [""], expected: 0, hidden: true },
      { args: [" "], expected: 1, hidden: true },
      { args: ["dvdf"], expected: 3, hidden: true },
      { args: ["abba"], expected: 2, hidden: true },
      { args: ["tmmzuxt"], expected: 5, hidden: true },
    ],
    starter: starter("longestUniqueRun", "s", "s: str", "int longestUniqueRun(string s)", "int longestUniqueRun(String s)"),
    referenceSolutions: ref(
      `function longestUniqueRun(s) {
  const last = new Map();
  let best = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    best = Math.max(best, right - left + 1);
  }
  return best;
}`,
      `class Solution:
    def longestUniqueRun(self, s: str) -> int:
        last = {}
        best = 0
        left = 0
        for right, ch in enumerate(s):
            if ch in last and last[ch] >= left:
                left = last[ch] + 1
            last[ch] = right
            best = max(best, right - left + 1)
        return best`,
      `class Solution {
public:
    int longestUniqueRun(string s) {
        unordered_map<char, int> last;
        int best = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s[right];
            if (last.count(ch) && last[ch] >= left) {
                left = last[ch] + 1;
            }
            last[ch] = right;
            best = max(best, right - left + 1);
        }
        return best;
    }
};`,
      `class Solution {
    public int longestUniqueRun(String s) {
        Map<Character, Integer> last = new HashMap<>();
        int best = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            if (last.containsKey(ch) && last.get(ch) >= left) {
                left = last.get(ch) + 1;
            }
            last.put(ch, right);
            best = Math.max(best, right - left + 1);
        }
        return best;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 38.9,
  },

  // #17 - Merge Booking Windows
  {
    id: "merge-windows",
    title: "Merge Booking Windows",
    difficulty: "Medium",
    topics: ["Arrays", "Sorting"],
    statement: [
      "A meeting room's bookings are given as `intervals`, where `intervals[i] = [start, end]`.",
      "Merge every pair of overlapping or touching windows and return the resulting list sorted by start time.",
      "Two windows touch when one ends exactly where the next begins, e.g. `[1, 4]` and `[4, 5]` merge into `[1, 5]`.",
    ],
    inputFormat: "A 2D integer array `intervals` of `[start, end]` pairs, in any order.",
    outputFormat: "A 2D array of merged, non-overlapping windows sorted by start.",
    constraints: ["1 ≤ intervals.length ≤ 10⁴", "0 ≤ start ≤ end ≤ 10⁴"],
    samples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]", explanation: "[1,3] and [2,6] overlap and merge into [1,6]." },
      { input: "intervals = [[1,4],[4,5]]", output: "[[1,5]]" },
    ],
    functionName: "mergeWindows",
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { args: [[[1, 4], [0, 4]]], expected: [[0, 4]], hidden: true },
      { args: [[[1, 4], [2, 3]]], expected: [[1, 4]], hidden: true },
      { args: [[[5, 7]]], expected: [[5, 7]], hidden: true },
    ],
    starter: starter("mergeWindows", "intervals", "intervals: list[list[int]]", "vector<vector<int>> mergeWindows(vector<vector<int>>& intervals)", "int[][] mergeWindows(int[][] intervals)"),
    referenceSolutions: ref(
      `function mergeWindows(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [start, end] of sorted) {
    const last = out[out.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      out.push([start, end]);
    }
  }
  return out;
}`,
      `class Solution:
    def mergeWindows(self, intervals: list[list[int]]) -> list[list[int]]:
        sorted_intervals = sorted(intervals)
        merged = []
        for start, end in sorted_intervals:
            if merged and start <= merged[-1][1]:
                merged[-1][1] = max(merged[-1][1], end)
            else:
                merged.append([start, end])
        return merged`,
      `class Solution {
public:
    vector<vector<int>> mergeWindows(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> merged;
        for (auto& interval : intervals) {
            if (merged.empty() || interval[0] > merged.back()[1]) {
                merged.push_back(interval);
            } else {
                merged.back()[1] = max(merged.back()[1], interval[1]);
            }
        }
        return merged;
    }
};`,
      `class Solution {
    public int[][] mergeWindows(int[][] intervals) {
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> merged = new ArrayList<>();
        for (int[] interval : intervals) {
            if (merged.isEmpty() || interval[0] > merged.get(merged.size() - 1)[1]) {
                merged.add(interval);
            } else {
                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);
            }
        }
        return merged.toArray(new int[merged.size()][]);
    }
}`
    ),
    timeLimitMs: 1500,
    acceptance: 47.2,
  },

  // #18 - Product Except Self
  {
    id: "product-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    topics: ["Arrays"],
    statement: [
      "Given an integer array `nums`, return an array `output` such that `output[i]` is equal to the product of all elements of `nums` except `nums[i]`.",
      "You must write an algorithm that runs in O(n) time without using division.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "An integer array of products.",
    constraints: ["2 ≤ nums.length ≤ 10⁵", "−30 ≤ nums[i] ≤ 30"],
    samples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" },
      { input: "nums = [-1,1,0,-3,3]", output: "[0,0,9,0,0]" },
    ],
    functionName: "productExceptSelf",
    tests: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6] },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { args: [[2, 3]], expected: [3, 2], hidden: true },
      { args: [[1, 1, 1]], expected: [1, 1, 1], hidden: true },
    ],
    starter: starter("productExceptSelf", "nums", "nums: list[int]", "vector<int> productExceptSelf(vector<int>& nums)", "int[] productExceptSelf(int[] nums)"),
    referenceSolutions: ref(
      `function productExceptSelf(nums) {
  const n = nums.length;
  const result = new Array(n).fill(1);
  let left = 1;
  for (let i = 0; i < n; i++) {
    result[i] = left;
    left *= nums[i];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    result[i] *= right;
    right *= nums[i];
  }
  return result;
}`,
      `class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        n = len(nums)
        result = [1] * n
        left = 1
        for i in range(n):
            result[i] = left
            left *= nums[i]
        right = 1
        for i in range(n - 1, -1, -1):
            result[i] *= right
            right *= nums[i]
        return result`,
      `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> result(n, 1);
        int left = 1;
        for (int i = 0; i < n; i++) {
            result[i] = left;
            left *= nums[i];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= right;
            right *= nums[i];
        }
        return result;
    }
};`,
      `class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] result = new int[n];
        Arrays.fill(result, 1);
        int left = 1;
        for (int i = 0; i < n; i++) {
            result[i] = left;
            left *= nums[i];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            result[i] *= right;
            right *= nums[i];
        }
        return result;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 52.4,
  },

  // #19 - Group Anagrams
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    topics: ["Strings", "Hash Map"],
    statement: [
      "Given an array of strings `strs`, group the anagrams together.",
      "You can return the answer in any order.",
    ],
    inputFormat: "An array of strings `strs`.",
    outputFormat: "A 2D array of grouped anagrams.",
    constraints: ["1 ≤ strs.length ≤ 10⁴", "0 ≤ strs[i].length ≤ 100", "strs[i] consists of lowercase English letters"],
    samples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
    ],
    functionName: "groupAnagrams",
    tests: [
      { args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["eat", "tea", "ate"], ["tan", "nat"], ["bat"]] },
      { args: [[""]], expected: [[""]], hidden: true },
      { args: [["a"]], expected: [["a"]], hidden: true },
    ],
    starter: starter("groupAnagrams", "strs", "strs: list[str]", "vector<vector<string>> groupAnagrams(vector<string>& strs)", "String[][] groupAnagrams(String[] strs)"),
    referenceSolutions: ref(
      `function groupAnagrams(strs) {
  const map = new Map();
  for (const s of strs) {
    const key = s.split('').sort().join('');
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(s);
  }
  return Array.from(map.values());
}`,
      `class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        from collections import defaultdict
        groups = defaultdict(list)
        for s in strs:
            key = ''.join(sorted(s))
            groups[key].append(s)
        return list(groups.values())`,
      `class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (string s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> result;
        for (auto& p : groups) {
            result.push_back(p.second);
        }
        return result;
    }
};`,
      `class Solution {
    public String[][] groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String s : strs) {
            char[] chars = s.toCharArray();
            Arrays.sort(chars);
            String key = new String(chars);
            groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
        }
        String[][] result = new String[groups.size()][];
        int i = 0;
        for (List<String> group : groups.values()) {
            result[i++] = group.toArray(new String[0]);
        }
        return result;
    }
}`
    ),
    timeLimitMs: 2000,
    acceptance: 58.1,
  },

  // #20 - Longest Consecutive Sequence
  {
    id: "longest-consecutive",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    topics: ["Arrays", "Hash Map"],
    statement: [
      "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence.",
      "You must write an algorithm that runs in O(n) time.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "An integer: the length of the longest consecutive sequence.",
    constraints: ["0 ≤ nums.length ≤ 10⁵", "−10⁹ ≤ nums[i] ≤ 10⁹"],
    samples: [
      { input: "nums = [100,4,200,1,3,2]", output: "4", explanation: "The longest consecutive sequence is [1,2,3,4]" },
      { input: "nums = [0,3,7,2,5,8,4,6,0,1]", output: "9" },
    ],
    functionName: "longestConsecutive",
    tests: [
      { args: [[100, 4, 200, 1, 3, 2]], expected: 4 },
      { args: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
      { args: [[]], expected: 0, hidden: true },
      { args: [[1]], expected: 1, hidden: true },
      { args: [[1, 2, 0, 1]], expected: 3, hidden: true },
    ],
    starter: starter("longestConsecutive", "nums", "nums: list[int]", "int longestConsecutive(vector<int>& nums)", "int longestConsecutive(int[] nums)"),
    referenceSolutions: ref(
      `function longestConsecutive(nums) {
  const set = new Set(nums);
  let longest = 0;
  for (const n of set) {
    if (!set.has(n - 1)) {
      let length = 1;
      while (set.has(n + length)) length++;
      longest = Math.max(longest, length);
    }
  }
  return longest;
}`,
      `class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        num_set = set(nums)
        longest = 0
        for n in num_set:
            if n - 1 not in num_set:
                length = 1
                while n + length in num_set:
                    length += 1
                longest = max(longest, length)
        return longest`,
      `class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> numSet(nums.begin(), nums.end());
        int longest = 0;
        for (int n : numSet) {
            if (numSet.find(n - 1) == numSet.end()) {
                int length = 1;
                while (numSet.find(n + length) != numSet.end()) length++;
                longest = max(longest, length);
            }
        }
        return longest;
    }
};`,
      `class Solution {
    public int longestConsecutive(int[] nums) {
        Set<Integer> numSet = new HashSet<>();
        for (int n : nums) numSet.add(n);
        int longest = 0;
        for (int n : numSet) {
            if (!numSet.contains(n - 1)) {
                int length = 1;
                while (numSet.contains(n + length)) length++;
                longest = Math.max(longest, length);
            }
        }
        return longest;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 43.7,
  },

  // #21 - Three Sum
  {
    id: "three-sum",
    title: "Three Sum",
    difficulty: "Medium",
    topics: ["Arrays", "Two Pointers"],
    statement: [
      "Given an integer array `nums`, return all unique triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
      "The solution set must not contain duplicate triplets.",
    ],
    inputFormat: "An integer array `nums`.",
    outputFormat: "A 2D array of unique triplets that sum to zero.",
    constraints: ["3 ≤ nums.length ≤ 3000", "−10⁵ ≤ nums[i] ≤ 10⁵"],
    samples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" },
      { input: "nums = [0,1,1]", output: "[]" },
      { input: "nums = [0,0,0]", output: "[[0,0,0]]" },
    ],
    functionName: "threeSum",
    tests: [
      { args: [[-1, 0, 1, 2, -1, -4]], expected: [[-1, -1, 2], [-1, 0, 1]] },
      { args: [[0, 1, 1]], expected: [] },
      { args: [[0, 0, 0]], expected: [[0, 0, 0]] },
      { args: [[-2, 0, 1, 1, 2]], expected: [[-2, 0, 2], [-2, 1, 1]], hidden: true },
    ],
    starter: starter("threeSum", "nums", "nums: list[int]", "vector<vector<int>> threeSum(vector<int>& nums)", "int[][] threeSum(int[] nums)"),
    referenceSolutions: ref(
      `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue;
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`,
      `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        nums.sort()
        result = []
        for i in range(len(nums) - 2):
            if i > 0 and nums[i] == nums[i - 1]:
                continue
            left, right = i + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                if total == 0:
                    result.append([nums[i], nums[left], nums[right]])
                    while left < right and nums[left] == nums[left + 1]:
                        left += 1
                    while left < right and nums[right] == nums[right - 1]:
                        right -= 1
                    left += 1
                    right -= 1
                elif total < 0:
                    left += 1
                else:
                    right -= 1
        return result`,
      `class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> result;
        for (int i = 0; i < nums.size() - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.size() - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.push_back({nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return result;
    }
};`,
      `class Solution {
    public int[][] threeSum(int[] nums) {
        Arrays.sort(nums);
        List<int[]> result = new ArrayList<>();
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    result.add(new int[]{nums[i], nums[left], nums[right]});
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++;
                    right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return result.toArray(new int[result.size()][]);
    }
}`
    ),
    timeLimitMs: 2000,
    acceptance: 32.8,
  },

  // #22 - Container With Most Water
  {
    id: "max-area",
    title: "Container With Most Water",
    difficulty: "Medium",
    topics: ["Arrays", "Two Pointers"],
    statement: [
      "You are given an integer array `height` of length n. There are n vertical lines such that the two endpoints of the ith line are `(i, 0)` and `(i, height[i])`.",
      "Find two lines that together with the x-axis form a container that holds the most water.",
      "Return the maximum amount of water a container can store.",
    ],
    inputFormat: "An integer array `height`.",
    outputFormat: "An integer: the maximum area.",
    constraints: ["2 ≤ height.length ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    samples: [
      { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "Lines at index 1 and 8 form container with area 49" },
      { input: "height = [1,1]", output: "1" },
    ],
    functionName: "maxArea",
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49 },
      { args: [[1, 1]], expected: 1 },
      { args: [[4, 3, 2, 1, 4]], expected: 16, hidden: true },
      { args: [[1, 2, 1]], expected: 2, hidden: true },
    ],
    starter: starter("maxArea", "height", "height: list[int]", "int maxArea(vector<int>& height)", "int maxArea(int[] height)"),
    referenceSolutions: ref(
      `function maxArea(height) {
  let left = 0, right = height.length - 1;
  let maxArea = 0;
  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    maxArea = Math.max(maxArea, area);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return maxArea;
}`,
      `class Solution:
    def maxArea(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        max_area = 0
        while left < right:
            area = min(height[left], height[right]) * (right - left)
            max_area = max(max_area, area)
            if height[left] < height[right]:
                left += 1
            else:
                right -= 1
        return max_area`,
      `class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int maxArea = 0;
        while (left < right) {
            int area = min(height[left], height[right]) * (right - left);
            maxArea = max(maxArea, area);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxArea;
    }
};`,
      `class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxArea = 0;
        while (left < right) {
            int area = Math.min(height[left], height[right]) * (right - left);
            maxArea = Math.max(maxArea, area);
            if (height[left] < height[right]) left++;
            else right--;
        }
        return maxArea;
    }
}`
    ),
    timeLimitMs: 1000,
    acceptance: 54.6,
  },

  // ==================== HARD PROBLEMS (23-25) ====================

  // #23 - Rain Over Terraces
  {
    id: "rain-terrace",
    title: "Rain Over Terraces",
    difficulty: "Hard",
    topics: ["Two Pointers", "Arrays", "Monotonic Stack"],
    statement: [
      "An elevation map is given as an array `heights` of non-negative integers, where each bar has width 1.",
      "After a heavy rain, water settles between the bars. Compute how many units of water are trapped.",
    ],
    inputFormat: "An integer array `heights`.",
    outputFormat: "A single integer: the total units of trapped water.",
    constraints: ["1 ≤ heights.length ≤ 2×10⁴", "0 ≤ heights[i] ≤ 10⁵"],
    samples: [
      { input: "heights = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "Six units settle in the four dips of the map." },
      { input: "heights = [4,2,0,3,2,5]", output: "9" },
    ],
    functionName: "trappedWater",
    tests: [
      { args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6 },
      { args: [[4, 2, 0, 3, 2, 5]], expected: 9 },
      { args: [[1]], expected: 0, hidden: true },
      { args: [[5, 4, 3, 2, 1]], expected: 0, hidden: true },
      { args: [[2, 0, 2]], expected: 2, hidden: true },
      { args: [[3, 0, 0, 2, 0, 4]], expected: 10, hidden: true },
    ],
    starter: starter("trappedWater", "heights", "heights: list[int]", "int trappedWater(vector<int>& heights)", "int trappedWater(int[] heights)"),
    referenceSolutions: ref(
      `function trappedWater(heights) {
  let left = 0, right = heights.length - 1;
  let leftMax = 0, rightMax = 0, total = 0;
  while (left < right) {
    if (heights[left] < heights[right]) {
      leftMax = Math.max(leftMax, heights[left]);
      total += leftMax - heights[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, heights[right]);
      total += rightMax - heights[right];
      right--;
    }
  }
  return total;
}`,
      `class Solution:
    def trappedWater(self, heights: list[int]) -> int:
        left, right = 0, len(heights) - 1
        left_max = right_max = total = 0
        while left < right:
            if heights[left] < heights[right]:
                left_max = max(left_max, heights[left])
                total += left_max - heights[left]
                left += 1
            else:
                right_max = max(right_max, heights[right])
                total += right_max - heights[right]
                right -= 1
        return total`,
      `class Solution {
public:
    int trappedWater(vector<int>& heights) {
        int left = 0, right = heights.size() - 1;
        int leftMax = 0, rightMax = 0, total = 0;
        while (left < right) {
            if (heights[left] < heights[right]) {
                leftMax = max(leftMax, heights[left]);
                total += leftMax - heights[left];
                left++;
            } else {
                rightMax = max(rightMax, heights[right]);
                total += rightMax - heights[right];
                right--;
            }
        }
        return total;
    }
};`,
      `class Solution {
    public int trappedWater(int[] heights) {
        int left = 0, right = heights.length - 1;
        int leftMax = 0, rightMax = 0, total = 0;
        while (left < right) {
            if (heights[left] < heights[right]) {
                leftMax = Math.max(leftMax, heights[left]);
                total += leftMax - heights[left];
                left++;
            } else {
                rightMax = Math.max(rightMax, heights[right]);
                total += rightMax - heights[right];
                right--;
            }
        }
        return total;
    }
}`
    ),
    timeLimitMs: 1500,
    acceptance: 29.6,
  },

  // #24 - Median of Two Sorted Arrays
  {
    id: "median-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    topics: ["Arrays", "Binary Search"],
    statement: [
      "Given two sorted arrays `nums1` and `nums2`, return the median of the two sorted arrays.",
      "The overall run time complexity should be O(log(m+n)).",
    ],
    inputFormat: "Two sorted integer arrays `nums1` and `nums2`.",
    outputFormat: "A number: the median value.",
    constraints: ["0 ≤ nums1.length, nums2.length ≤ 1000", "−10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶"],
    samples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.0", explanation: "Merged array is [1,2,3], median is 2" },
      { input: "nums1 = [1,2], nums2 = [3,4]", output: "2.5", explanation: "Merged array is [1,2,3,4], median is (2+3)/2 = 2.5" },
    ],
    functionName: "findMedianSortedArrays",
    tests: [
      { args: [[1, 3], [2]], expected: 2.0 },
      { args: [[1, 2], [3, 4]], expected: 2.5 },
      { args: [[], [1]], expected: 1.0, hidden: true },
      { args: [[2], []], expected: 2.0, hidden: true },
    ],
    starter: starter("findMedianSortedArrays", "nums1, nums2", "nums1: list[int], nums2: list[int]", "double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2)", "double findMedianSortedArrays(int[] nums1, int[] nums2)"),
    referenceSolutions: ref(
      `function findMedianSortedArrays(nums1, nums2) {
  const merged = [...nums1, ...nums2].sort((a, b) => a - b);
  const n = merged.length;
  if (n % 2 === 1) return merged[Math.floor(n / 2)];
  return (merged[n / 2 - 1] + merged[n / 2]) / 2;
}`,
      `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        merged = sorted(nums1 + nums2)
        n = len(merged)
        if n % 2 == 1:
            return float(merged[n // 2])
        return (merged[n // 2 - 1] + merged[n // 2]) / 2.0`,
      `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        vector<int> merged;
        merged.insert(merged.end(), nums1.begin(), nums1.end());
        merged.insert(merged.end(), nums2.begin(), nums2.end());
        sort(merged.begin(), merged.end());
        int n = merged.size();
        if (n % 2 == 1) return merged[n / 2];
        return (merged[n / 2 - 1] + merged[n / 2]) / 2.0;
    }
};`,
      `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        int[] merged = new int[nums1.length + nums2.length];
        System.arraycopy(nums1, 0, merged, 0, nums1.length);
        System.arraycopy(nums2, 0, merged, nums1.length, nums2.length);
        Arrays.sort(merged);
        int n = merged.length;
        if (n % 2 == 1) return merged[n / 2];
        return (merged[n / 2 - 1] + merged[n / 2]) / 2.0;
    }
}`
    ),
    timeLimitMs: 2000,
    acceptance: 38.2,
  },

  // #25 - Regular Expression Matching
  {
    id: "regex-matching",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    topics: ["Strings", "Dynamic Programming"],
    statement: [
      "Given an input string `s` and a pattern `p`, implement regular expression matching with support for '.' and '*' where:",
      "- '.' Matches any single character.",
      "- '*' Matches zero or more of the preceding element.",
      "The matching should cover the entire input string (not partial).",
    ],
    inputFormat: "Two strings `s` and `p`.",
    outputFormat: "Boolean: true if s matches p.",
    constraints: ["0 ≤ s.length ≤ 20", "0 ≤ p.length ≤ 30", "s contains only lowercase letters", "p contains lowercase letters, '.', and '*'"],
    samples: [
      { input: 's = "aa", p = "a"', output: "false", explanation: "a does not match the entire string aa" },
      { input: 's = "aa", p = "a*"', output: "true", explanation: "* means zero or more of the preceding element, a" },
      { input: 's = "ab", p = ".*"', output: "true", explanation: ".* means zero or more (.) of any character" },
    ],
    functionName: "isMatch",
    tests: [
      { args: ["aa", "a"], expected: false },
      { args: ["aa", "a*"], expected: true },
      { args: ["ab", ".*"], expected: true },
      { args: ["aab", "c*a*b"], expected: true, hidden: true },
      { args: ["mississippi", "mis*is*p*."], expected: false, hidden: true },
    ],
    starter: starter("isMatch", "s, p", "s: str, p: str", "bool isMatch(string s, string p)", "boolean isMatch(String s, String p)"),
    referenceSolutions: ref(
      `function isMatch(s, p) {
  const dp = Array(s.length + 1).fill(null).map(() => Array(p.length + 1).fill(false));
  dp[0][0] = true;
  for (let j = 1; j <= p.length; j++) {
    if (p[j - 1] === '*') dp[0][j] = dp[0][j - 2];
  }
  for (let i = 1; i <= s.length; i++) {
    for (let j = 1; j <= p.length; j++) {
      if (p[j - 1] === '*') {
        dp[i][j] = dp[i][j - 2];
        if (p[j - 2] === '.' || p[j - 2] === s[i - 1]) {
          dp[i][j] = dp[i][j] || dp[i - 1][j];
        }
      } else if (p[j - 1] === '.' || p[j - 1] === s[i - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      }
    }
  }
  return dp[s.length][p.length];
}`,
      `class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        dp = [[False] * (len(p) + 1) for _ in range(len(s) + 1)]
        dp[0][0] = True
        for j in range(1, len(p) + 1):
            if p[j - 1] == '*':
                dp[0][j] = dp[0][j - 2]
        for i in range(1, len(s) + 1):
            for j in range(1, len(p) + 1):
                if p[j - 1] == '*':
                    dp[i][j] = dp[i][j - 2]
                    if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                        dp[i][j] = dp[i][j] or dp[i - 1][j]
                elif p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
        return dp[len(s)][len(p)]`,
      `class Solution {
public:
    bool isMatch(string s, string p) {
        int m = s.length(), n = p.length();
        vector<vector<bool>> dp(m + 1, vector<bool>(n + 1, false));
        dp[0][0] = true;
        for (int j = 1; j <= n; j++) {
            if (p[j - 1] == '*') dp[0][j] = dp[0][j - 2];
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p[j - 1] == '*') {
                    dp[i][j] = dp[i][j - 2];
                    if (p[j - 2] == '.' || p[j - 2] == s[i - 1]) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                } else if (p[j - 1] == '.' || p[j - 1] == s[i - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        return dp[m][n];
    }
};`,
      `class Solution {
    public boolean isMatch(String s, String p) {
        int m = s.length(), n = p.length();
        boolean[][] dp = new boolean[m + 1][n + 1];
        dp[0][0] = true;
        for (int j = 1; j <= n; j++) {
            if (p.charAt(j - 1) == '*') dp[0][j] = dp[0][j - 2];
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (p.charAt(j - 1) == '*') {
                    dp[i][j] = dp[i][j - 2];
                    if (p.charAt(j - 2) == '.' || p.charAt(j - 2) == s.charAt(i - 1)) {
                        dp[i][j] = dp[i][j] || dp[i - 1][j];
                    }
                } else if (p.charAt(j - 1) == '.' || p.charAt(j - 1) == s.charAt(i - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                }
            }
        }
        return dp[m][n];
    }
}`
    ),
    timeLimitMs: 2000,
    acceptance: 27.4,
  },
];

/**
 * Helper to get a problem by ID, with fallback
 */
export const getProblem = (id?: string | null) => problems.find((p) => p.id === id) ?? problems[0]!;

/**
 * Legacy export for backward compatibility with seed script
 * Maps to JavaScript solutions only (for simulated opponent)
 */
export const opponentSolutions: Record<string, string> = Object.fromEntries(
  problems.map(p => [p.id, p.referenceSolutions.javascript])
);
