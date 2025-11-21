class Animal1 {
    color = "Red";
    constructor(a_name){
        this.a_name = a_name
    }

    // No need to used 'function'
    displayColor(){
        console.log(this.color); // This line will show error because this.color is not used!
    }
    displayName(){
        console.log(this.a_name);
    }
}

const anml = new Animal1("Lion");
anml.displayColor(); 
anml.displayName();

//Example of static keyword
// static = belongs to the class, not the objects
//               properties: useful for caches, fixed-configuration
//               methods:    useful for utility functions

class Car{

    static numberOfCars = 0;

    constructor(model){
        this.model = model;
        Car.numberOfCars += 1;
    }
    static startRace(){
        console.log("3...2...1...GO!");
    }
}

const car1 = new Car("Mustang");
const car2 = new Car("Corvette");
const car3 = new Car("BMW");

console.log(Car.numberOfCars);
Car.startRace();
