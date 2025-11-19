 function sayHi(greet_msg) {
    console.log(`${greet_msg}`);
 }

 function greet(usrName, message, callback) {
    let greet_msg = `Hello ${usrName}, ${message}`;
    callback(greet_msg);
 }

 greet("Agam","Welcome to Wohlig Transformations!", sayHi);