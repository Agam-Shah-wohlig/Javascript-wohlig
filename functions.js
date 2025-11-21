function showMessage(from, text) {

  from = '*' + from + '*'; // make "from" look nicer

  alert( from + ': ' + text );
}

let from = "Ann";

showMessage(from, "Hello"); // *Ann*: Hello

// the value of "from" is the same, the function modified a local copy
alert( from ); // Ann


//Function Expressions
// A function expression is when a function is assigned to a variable, instead of being declared normally.

const sum = function(a, b) {
  return a + b;
};
console.log(sum(2, 3)); // Outputs: 5
// It can have name or no-name (anonymous function...Just like above)
// Usually for better readability, a name is given to the function expression

// Arrow Function Expressions.

const multiply = (a, b) => a * b;

console.log(multiply(3, 4)); // Outputs: 12


// Function Expression vs Function Declaration

/* Function Expression
  -> NOT hoisted fully
  -> Must be defined before use
  -> Useful for callbacks */

const greet = function() {
  console.log("Hi");
};

greet(); // Works fine

/* Function Declaration
  -> Hoisted fully
  -> Can be called before definition
  -> Useful for main functions */

  function greet() {
  console.log("Hi");
}
greet(); // Works fine


// why use Function Expressions?
// 1. They can be anonymous
// 2. They can be used as IIFE (Immediately Invoked Function Expressions)
// 3. They can be passed as arguments to other functions (callbacks)
// 4. They cab bve used as Closure functions.
// 5 . They can be used as Arrow functions.