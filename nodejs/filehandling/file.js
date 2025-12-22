const fs = require("fs")

// Write to a file. Writing to a non-existing file will create a file!
//This is Synchronous
// fs.writeFileSync("./test.txt","Hello My name is Agam")

//This is Async
// fs.writeFile("./test.txt", "This is from Async", (err) => {}) // As you can see it overwrite the text in 
                                                                    // test.txt

// Append to a file
// Synchronous
// const result = fs.readFileSync("./contacts.txt","utf-8");
// console.log(result)

// Async Reading
//Async reading function does not return anything and we must include the callback other wise it throws error!
// fs.readFile("./contacts.txt", "utf-8", (err,result)=> {
//     if (err){
//         console.log(err);
//     } else {
//         console.log(result);
//     }
// });

// fs.cpSync("./test.txt","./copy.txt") // Use to Copy content from one file to another


// fs.unlinkSync("./copy.txt"); // It will delete the file copy.txt

//Append Something to file.
// This can be used to append logs like what files was access by what user at what time!

// fs.appendFileSync("./contacts.txt", `${Date.now()} Hey There\n`);

// Check the details of a file.
// const result = fs.statSync("./test.txt");
// console.log(result)

fs.mkdirSync("mkdirfolder/a/b/", {recursive:true}); // This will create Directory/folder
