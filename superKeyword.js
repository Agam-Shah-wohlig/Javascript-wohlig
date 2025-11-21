// super = Refers to the parent class. 
// Commonly used to invoke constructor of a parent class

/* Problem with super keyword 
    -> No Code Reusability 
    -> Will throw reference error

Look at the below Example1
** Uncomment the below Problem code and Comment the Solution Code..to see the difference!
*/
/*
class Animal2{
        
}

class Rabbit2 extends Animal2{

    constructor(name, age, runSpeed){
        this.name = name;
        this.age = age;
        this.runSpeed = runSpeed;
    }
}
class Fish2 extends Animal2{

    constructor(name, age, swimSpeed){
        this.name = name;
        this.age = age;
        this.swimSpeed = swimSpeed;
    }
}
class Hawk2 extends Animal2{

    constructor(name, age, flySpeed){
        this.name = name;
        this.age = age;
        this.flySpeed = flySpeed;
    }
}

const rabbit2 = new Rabbit2("rabbit", 1, 40);
const fish2= new Fish2("fish", 2, 80);
const hawk2 = new Hawk2("hawk", 3, 200);

console.log(rabbit2.name);
console.log(rabbit2.age);
console.log(rabbit2.runSpeed);
*/


// solution code!

class Animal2{
    
    constructor(name, age){
        this.name = name;
        this.age = age;
    }
}
class Rabbit2 extends Animal2{

    constructor(name, age, runSpeed){
        super(name, age);
        this.runSpeed = runSpeed;
    }
}
class Fish2 extends Animal2{

    constructor(name, age, swimSpeed){
        super(name, age);
        this.swimSpeed = swimSpeed;
    }
}
class Hawk2 extends Animal2{

    constructor(name, age, flySpeed){
        super(name, age);
        this.flySpeed = flySpeed;
    }
}

const rabbit2 = new Rabbit2("rabbit", 1, 40);
const fish2 = new Fish2("fish", 2, 80);
const hawk2 = new Hawk2("hawk", 3, 200);

console.log(rabbit2.name);
console.log(rabbit2.age);
console.log(rabbit2.runSpeed);