// function add(a, b){
//     return a+b;
// }

// function sub(a, b){
//     return a-b;
// }

// module.exports = add;
// module.exports = sub;

//the above line will overwrite "add" function and the code of "sub" function will run
// To solve this we need to create an object. Uncomment the code below to see the effect!

// module.exports = {
//     add,
//     sub
// }


//there is another way of writing this using arrow functions
exports.add = (a,b) => a+b;
exports.sub = (a,b) => a-b;