"use strict";
/* closures help in security by not letting the variable 
inside a function to be accessed from outside the function*/

 /* It also helps in maintaning variable state even after the function
 execution is over */

// Example without closure: Uncomment the whole example to understand closure better
    /*
 let points = 0;

 function increamentPoints() {
    points += 1;
    console.log(`Point Increament by 1 ${points}`);
 }

 function decreamentPoints() {
    points -= 1;
    console.log(`Point Decreament by 1 ${points}`);
 }

 function getPoints() {
    return points;
 }

 console.log(getPoints());
 increamentPoints();
 increamentPoints();
 increamentPoints();
 decreamentPoints();
 decreamentPoints();
 console.log(getPoints());

 points = 100; // variable is directly modified from outside

 console.log(getPoints()); // returns 100 which is not expected

 //In the above example we are able to maintain the state of variable 'points'
 //but in some cases we wont be able! Look at the below Example!
    */
 /*
 function checkState(){
    let state = 0;

    state += 1;
    console.log(`State is ${state}`);
} 

checkState(); // State is 1
checkState(); // State is 1
checkState(); // State is 1
    */
/* In the above example we are not able to maintain the state of variable 'state'
 because every time we call the function the variable is re-initialized to 0.
 To solve this problem we can use closures. Look at the below example */

 // Example with closure

 function Game() {
 let points = 0;

 function increamentPoints() {
    points += 1;
    console.log(`Point Increament by 1 ${points}`);
 }

 function decreamentPoints() {
    points -= 1;
    console.log(`Point Decreament by 1 ${points}`);
 }

 function getPoints() {
    return points;
 }
    return {increamentPoints, decreamentPoints, getPoints}; 
 }

const game = Game(); // creating an instance of Game
 console.log(game.getPoints());
 game.increamentPoints();
 game.increamentPoints();
 game.increamentPoints();
 game.decreamentPoints();
 game.decreamentPoints();
 console.log(game.getPoints());


 points = 100 // throwing error as points is not accessible from outside i.e. Data Security
 console.log(game.getPoints()); // returns correct value
