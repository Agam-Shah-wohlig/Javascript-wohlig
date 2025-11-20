
// Spread unpacks the structure into individual elements
// Rest packs individual elements into a structure

// Spread Example
const arr = [1,2,3,4];

const newArr = [...arr, 5, 6, 7];
console.log(newArr);

function sum(...numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sum(1, 2, 3, 4, 5));


// Destructuring with Rest
// here arr = [1,2,3,4]
const [first, second, ...rest] = arr;
console.log(first); // 1
console.log(second); // 2
console.log(rest); // [3, 4]


// Related Topic Destructuring Assignment!
console.log("Desturcturing Assignment Examples:");
const obj = { a: 1, b: 2, c: 3 };
const { a, ...others} = obj;
console.log(a); // 1
console.log(others); // { b: 2, c: 3 }


const person = {
  name: "John",
  age: 30,
  country: "USA",
  hobby: "coding"
};

// Destructure + Rest
const { name, ...other} = person;

console.log(name);   // "John"
console.log(other); // { age: 30, country: "USA", hobby: "coding" }

// Spread to copy
const updatedPerson = { ...person, age: 31 };
