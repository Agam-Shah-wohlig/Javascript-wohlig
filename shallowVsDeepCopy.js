/*
First: The Biggest Rule in JavaScript
 ->Primitive values are always copied by VALUE
 ->Objects, arrays, and functions are copied by REFERENCE

This is the foundation for understanding shallow vs deep copy.
*/
/*
2. Primitive Types (copy by value)

Types:
    number
    string
    boolean
    null
    undefined
    bigint
    symbol */

let a = 10;
let b = a;
b = 20;
console.log(a); // 10 change in b does not affect a
console.log(b); // 20

/* 3. Reference Types (copy by reference)

Types:
    Object
    Array
    Function
    Date
    RegExp
    Maps, Sets
    Custom objects */

let obj1 = { x: 1 };
let obj2 = obj1;

obj2.x = 99;

console.log(obj1.x); // 99  change in obj2 affects obj1
console.log(obj2.x); // 99

/* 4. Shallow Copy vs Deep Copy

a) Shallow Copy
    -> Makes a new object, but copies references to nested objects.
    */

const obj3 = {
  name: "Bob",
  address: { city: "NY" }
};

const obj4 = { ...obj3 }; // shallow copy

obj4.name = "Alice";
obj4.address.city = "LA";

console.log("Object3",obj3); // name is not changes but city is changed to "LA"
console.log("Object4",obj4); // "LA" //Nested object reference is shared

/*  b) Deep Copy

Creates a complete, independent clone.
All nested objects are copied too.
*/

const obj5 = {
  name: "Bob",
  address: { city: "NY" }
};

const obj6= structuredClone(obj5);

obj6.name = "Alice";
obj6.address.city = "LA";

//Completely independent. Safe for Nested Objects
console.log("Object5",obj5); 
console.log("Object6",obj6);         