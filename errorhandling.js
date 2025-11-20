/*
Error = An Object that is created to represent a problem that occurs
             Occur often with user input or establishing a connection

 try { } = Encloses code that might potentially cause an error
 catch { } = Catch and handle any thrown Errors from try { }
 finally { } = (optional) Always executes. Used mostly for clean up
                    ex. close files, close connections, release resources
*/

class CustomError extends Error {
    constructor(message) {
        super(message);       // Pass message to parent Error class
        this.name = "CustomError"; // Set custom error name
    }
}

try {
    const dividend = Number(window.prompt("Enter a dividend: "));
    const divisor = Number(window.prompt("Enter a divisor: "));

    if (isNaN(dividend) || isNaN(divisor)) {
        throw new CustomError("Values must be numbers");
    }

    if (divisor === 0) {
        throw new CustomError("You can't divide by zero!");
    }

    const result = dividend / divisor;
    console.log("Result:", result);
} 
catch (error) {
    if (error instanceof CustomError) {
        console.error(`Custom Error Caught! Message: ${error.message}`);
    } else {
        console.error("Unknown error:", error);
    }
} 
finally {
    console.log("Finally Always executes regardless of error occurrence.");
}

console.log("You have reached the end!");
