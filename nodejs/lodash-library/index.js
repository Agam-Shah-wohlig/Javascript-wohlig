const _ = require("lodash");

 // 1. SUMMING VALUES

console.log("1. SUMMING VALUES\n");

const numbers = [1, 2, 3];

// Vanilla JS (long approach)
let manualSum = 0;
for (let i = 0; i < numbers.length; i++) {
  manualSum += numbers[i];
}

// Using reduce()
let reducedSum = numbers.reduce((a, b) => a + b);

// Lodash one-liner
let lodashSum = _.sum(numbers);

// Demonstrate also works with objects:
let objSum = _.sum(Object.values({ a: 5, b: 10, c: 15 }));

console.log("Manual sum:", manualSum);
console.log("Reduce sum:", reducedSum);
console.log("Lodash sum:", lodashSum);
console.log("Lodash object sum:", objSum);
console.log("\n");


 // 2. FILTERING OBJECTS USING _.filter

console.log("2. FILTERING OBJECTS USING _.filter\n");

const pets = [
  { name: "Spot", age: 6, color: "brown" },
  { name: "Rex", age: 2, color: "black" },
  { name: "Luna", age: 6, color: "brown" }
];

// Vanilla JS: find pets age 6 AND color brown
let manualMatches = [];
for (let p of pets) {
  if (p.age === 6 && p.color === "brown") {
    manualMatches.push(p);
  }
}

// Lodash: one line
let lodashMatches = _.filter(pets, { age: 6, color: "brown" });

console.log("Manual filtered pets:", manualMatches);
console.log("Lodash filtered pets:", lodashMatches);
console.log("\n");



 // 3. MERGING OBJECTS USING _.merge

console.log("3. MERGING OBJECTS USING _.merge\n");

let user = { name: "Ryan", age: 25, eyeColor: "blue" };
let updates = { age: 26, eyeColor: "blue" };

// Vanilla JS merge
let manuallyMerged = { ...user };
for (let key in updates) {
  manuallyMerged[key] = updates[key];
}

// Lodash merge
let lodashMerged = _.merge({}, user, updates); 
// (Merged into a new object for safety)

console.log("Manual merge:", manuallyMerged);
console.log("Lodash merge:", lodashMerged);
console.log("\n");



 // 4. CHAINING: FLATTEN → SQUARE → SUM


console.log("4. CHAINING (flatten → square → sum)\n");

const nestedArray = [[1, 2], [3, 4], [5, 6, 7]];

// Vanilla JS version
const flat = nestedArray.reduce((a, b) => a.concat(b), []);
const squared = flat.map(n => n * n);
const manualChainedSum = squared.reduce((a, b) => a + b, 0);

// Lodash explicit chaining
const explicitChainResult = _.chain(nestedArray)
  .flattenDeep()
  .map(n => n * n)
  .sum()
  .value();

// Lodash implicit chaining
const implicitChainResult = _(nestedArray)
  .flattenDeep()
  .map(n => n * n)
  .sum();   // no .value() needed

console.log("Manual chained result:", manualChainedSum);
console.log("Explicit chain (lodash):", explicitChainResult);
console.log("Implicit chain (lodash):", implicitChainResult);
console.log("\n");



