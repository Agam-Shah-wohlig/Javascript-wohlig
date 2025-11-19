 const numbers = [1,2,3,4,5];

 console.log(numbers);

 // For Each
 numbers.forEach((val) => { console.log(val**2)}); // does not return anything

 // Map
 const newArr = numbers.map((val) => { return val**2 }); // returns a new array after applying the operation on each element

 console.log(`This is new Arr: ${newArr}`);

 // Filter
 const newArrV2 = numbers.filter((val) => {
    if(val % 2 == 0) return val
    }); //returns only those values which satisfy the condition

 console.log(`This is new ARR V2: ${newArrV2}`); 

 //Reduce 
 let val2 = numbers.reduce((acc, curr) => {return acc + curr}); // reduces the array to a single value based on the operation provided})   
 console.log(`This is reduced value: ${val2}`);

 // Find and FindIndex

 console.log(numbers.find((val) => { return val === 4}));
 
 console.log(numbers.findIndex((val) => { return val === 4}));

 // push and pop
 numbers.push(6);
 console.log(numbers);
 
 numbers.pop();
 console.log(numbers);  
 
 // fill
 numbers.fill(0,2,4); // fill value 0 starting from index 2 to index 4 (4 not included)
 console.log("Fill Example!",numbers); 

 //includes
 console.log(numbers.includes(3)); // false because we filled 0 at index 2
 console.log(numbers.includes(0)); // true  

 // slice and splice
 const newArrV3 = numbers.slice(1,4); // does not modify the original array
 console.log("New ARR V3 after slicing",newArrV3);
 console.log("Old array numbers after slicing",numbers); 

 const newArrV4 = numbers.splice(1,2); // Modifies the original array
 console.log("New ARr V4 after Splicing", newArrV4);
 console.log("Old array numbers after Splicing",numbers);

 const nums = [1,2,3,4,5]; // resetting numbers array for further operations

 // some and every

 const hasEven = nums.some((num) =>  { return num % 2 === 0}); // returns true if at least one element satisfies the condition
 console.log(hasEven); // true because there are even elements in the array

 const allEven = nums.every((num) =>  {return num % 2 === 0}); // returns true if all elements satisfy the condition
 console.log(allEven); // false because not all elements are even in the array

 // concat and join
 const moreNumbers = [7,8,9];
 const combinedArr = nums.concat(moreNumbers); // combines two arrays
 console.log("Combined Array:", combinedArr);
 console.log("Original numbers array after concat:", nums); // original array remains unchanged

 const joinedString = nums.join('-'); // joins array elements into a string with specified separator
 console.log("Joined String:", joinedString);

 // reverse
 const reversedArr = nums.reverse(); // reverses the array in place
 console.log("Reversed Array:", reversedArr);
 console.log("Original numbers array after reverse:", nums); // original array is modified  

 // indexOf and lastIndexOf

 /*
 array.indexOf(searchElement, fromIndex)
 searchElement → value to search

 fromIndex → optional, where to start searching (default is 0)
 */
 const fruits = ["apple", "banana", "orange", "apple"];
 console.log(fruits.indexOf("apple")); // 0 (first apple) 
 console.log(fruits.indexOf("banana"));
 console.log(fruits.indexOf("grape")); // -1 (not found)
 console.log(fruits.indexOf("apple", 1)); // 3 (start searching from index 1)
 

 /*
 array.lastIndexOf(searchElement, fromIndex)
 fromIndex → optional, search backwards starting from this index (default is array.length - 1)
 */ 
 console.log(fruits.lastIndexOf("apple")); // 3 (last apple)
 console.log(fruits.lastIndexOf("banana")); // 1
 console.log(fruits.lastIndexOf("grape")); // -1 (not found)
 console.log(fruits.lastIndexOf("apple", 2)); // 0 (search backwards from index 2)

 // flat and flatmap

 const nested = [1, [2, 3], [4, [5, 6]]];

 console.log(nested.flat()); // (depth = 1 by default) //modiefies the original array
 console.log(nested.flat(2)); // ( depth = 2. flatten 2 levels) //modifies the original array

 const arr = [1, [2, 3], [4, [5, 6]]];
 const result = arr.flatMap((x) => { return x * 2}); // first maps each element to a new value, then flattens the result into a new array
 console.log(result); 

 // the above will give an error because we are trying to multiply an array with a number
 // Solution 1
 const arrV2 = [1, 2, 3, 4];
 const resultV2 = arrV2.flatMap((x) => { return x * 2});
 console.log("Solution 1",resultV2); // [2, 4, 6, 8]

 // Solution 2
 const resultV3 = arr.flat(2).map((x) => { return x * 2}); 
 console.log("Solution 2",resultV3); // [2, 4, 6, 8, 10, 12]

 // Solution 3
 const resultV4 = arr.flatMap((x) => { return Array.isArray(x) ? x : x * 2});
 console.log("Solution 3",resultV4); // [2, 2, 3, 4, 5, 6]




