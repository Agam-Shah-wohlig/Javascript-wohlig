// 1. __dirname

console.log("1. __dirname:");
console.log(__dirname);
console.log("\n");



// 2. __filename
 
console.log("2. __filename:");
console.log(__filename);
console.log("\n");


// 3. require, module, exports
 
console.log("3. require, module, exports:");

// Show that these globals exist:
console.log("typeof require:", typeof require);
console.log("typeof module:", typeof module);
console.log("typeof exports:", typeof exports);
console.log("\n");



 // 4. process global
 
console.log("4. process:");
console.log("Process ID:", process.pid);
console.log("Platform:", process.platform);

// Environment variables (safe example):
console.log("Node environment:", process.env.NODE_ENV || "not set");
console.log("\n");



 // 5. global object
 
console.log("5. global object:");

global.myGlobalValue = "Hello from global!";
console.log("global.myGlobalValue:", global.myGlobalValue);

// Check that normal variables are NOT global:
let notGlobal = "I am NOT global";
console.log("global.notGlobal:", global.notGlobal); // undefined
console.log("\n");



 // 6. Demonstrating module scope
 
console.log("6. Module scope demo:");

var x = 100;  // NOT global!
console.log("Is x available on global?", global.x); // undefined
console.log("\n");



 // 7. Attach a function to global (not recommended)

console.log("7. Attaching a function to global:");

global.sayHello = function(name) {
    return `Hello, ${name}!`;
}

console.log(sayHello("Node.js"));
console.log("\n");



 //8. Using global as shared state (again, not recommended)

console.log("8. Global shared state:");

global.sharedCounter = 0;

function increment() {
    global.sharedCounter++;
}

increment();
increment();
increment();

console.log("sharedCounter =", global.sharedCounter);
console.log("\n");



 //9. Showing wrapper function behavior

console.log("9. Node file wrapper function:");

console.log("These names exist only in module scope:");
console.log("__dirname =", __dirname);
console.log("__filename =", __filename);
console.log("exports =", exports);
console.log("\n");


