
// let will be used only inside the scope {} if not defined outside/Globally.
// It will not mess up with other variables of same name in other scopes.

function testLet() {
    let a = 10;
    if (true) {
        let a = 20; // Different 'a' in this block scope
        let b = 30; // 'b' is block scoped
        console.log("Inside block, a =", a); // 20
    }
    console.log("Outside block, a =", a); // 10
    //console.log("Outside block, b =", b); // undefined because 'b' is not accessible here
}
testLet();

// var is function-scoped or globally-scoped. It does not respect block scope.
function testVar() {
    var a = 10;
    if (true) {
        var a = 20; // Different 'a' in this block scope
        var b = 30; // 'b' is block scoped
        console.log("Inside block, a =", a); // 20
    }
    console.log("Outside block, a =", a); // 10
    console.log("Outside block, b =", b); // 30 // Can access 'b' here because 'var' is function-scoped
    
}
testVar();

// var can mess with windows/global scope if not defined inside a function.

var name = "Global Name"; // Global variable

// above variable sets the window.name property to Global name which is not desired.
// go to browser console and type window.name to see the effect of var.

//Const is block-scoped like let but cannot be reassigned.
function testConst() {
    const a = 10;
    console.log("Initial value of a =", a); // 10
    //a = 20; // This will throw an error: Assignment to constant variable.
    if (true) {
        const a = 20; // Different 'a' in this block scope
        console.log("Inside block, a =", a); // 20
    }
    console.log("Outside block, a =", a); // 10
}
testConst();