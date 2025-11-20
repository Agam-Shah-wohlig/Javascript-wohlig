// console.time() = Starts a timer you can use to 
//                               track how long an operation takes
//                              Give each timer a unique name.

//start
console.time("Response time");

alert("CLICK THE OK BUTTON!");
setTimeout(() => console.log("HELLO!"), 3000); // Runs after 3 seconds. Typically used in async operations

//end
console.timeEnd("Response time");