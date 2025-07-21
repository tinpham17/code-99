/**
 * Iterative approach using a for loop
 * Time Complexity: O(n) - loops n times
 * Space Complexity: O(1) - uses constant extra space
 */
function sum_to_n_a(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

/**
 * Mathematical formula approach (Gauss's formula)
 * Time Complexity: O(1) - constant time calculation
 * Space Complexity: O(1) - uses constant extra space
 */
function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
}

/**
 * Recursive approach
 * Time Complexity: O(n) - makes n recursive calls
 * Space Complexity: O(n) - uses call stack for recursion
 */
function sum_to_n_c(n: number): number {
  if (n <= 1) return n;
  return n + sum_to_n_c(n - 1);
}
