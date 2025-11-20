 
 // promises are used to handle asynchronous operations in JavaScript

// Example of a promise

const myPromise = new Promise((resolve, reject) => {
    const fileuploaded = true;
    if (fileuploaded) {
        resolve("File Uploaded Successfully");
    } else {
        reject("File not uploaded");
    }
})

myPromise.then((value) => {console.log(value)})
         .catch((error) => {console.log(error)});

/*here newPromise is an executioner function that takes one parameter i.e. a callback function.
 This callback function takes 2 arguments resolve and reject and both are functions.
 resolve is called when the promise is fulfilled successfully and reject is called when the promise is rejected.
 resolve will call then() and passes the value to then() and then will dp the task.
 reject will call catch() and passes the error to catch() and catch will handle the error.*/


// Example of async/await
//Async functions always return a promise.

async function FileUpload() {
    const fileuploadedV2 = true;
    if (fileuploadedV2) {
        return "File Uploaded Successfully using async";
    } else {
        throw "File not uploaded using async";
    }
}

FileUpload().then((value) => console.log(value))
            .catch((error) => console.log(error)); 

// Another way of writing the abopve function without using the async keyword

function FileUploadV2() {
    const fileuploadedV3 = true;
    if (fileuploadedV3) {
        return Promise.resolve("File Uploaded Successfully without using Async keyword");
    } else{
        return Promise.reject("File not uploaded without using Async keyword");
    }
}

FileUploadV2().then((value) => console.log(value))
               .catch((error) => console.log(error));



// Await is used to wait for a promise to be resolved or rejected inside an async function.
/*
What await really does?
    -> await pauses only the execution of the async function it is inside.
    -> It does not block the entire JavaScript thread.
    -> JavaScript is single-threaded but asynchronous, so while your async function is “waiting” for a Promise to resolve, other code outside that function keeps running.
                  
  Async Function:                 Main Thread:

1. Start                            Start other code
2. await wait(2s)                   ⬅ pause here, go do other stuff
                                    Other code runs
3. after await, continue            2s later: resume async function
*/

let a = 2;
let b = 3;

let result = a + b;

async function fetchData() {
    const jsondata = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    console.log(await jsondata.json());
}

fetchData();
console.log("result:", result);

/* When we run the above code, "result: 5" will be logged first and then the fetched data 
 will be logged after that because fetchData() is an async function and it 
 contains await which pauses the execution of fetchData() until the 
 fetch promise is resolved, meanwhile the main thread continues to run and logs the result.*/