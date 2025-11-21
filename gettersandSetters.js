// get = binds an object property to a function 
//          when that property is accessed
// set = binds an object property to a function
//          when that property is assigned a value

class Plane{
     constructor(power){
        this._power = power;
        this._gas = 25;
     }

     get power(){
        return this._power
     }

     get gas(){
        return `${this._gas}L (${this._gas*50/100}%)`
     }

     set gas(value){
        if (value > 50){
            value = 50;
        } 
        else if (value < 0){
            value = 0;
        }
        return this._gas = value;
     }  

}

const pObj = new Plane(400, 10);
pObj.power = 100000 // Even after changing the value its still 400.
pObj._power = 1 // Ofcourse we can do this but this develoeprs will know 
//                 that a protected variable is access outside class which is not advisable.

console.log(pObj.power);

pObj.gas = 100;
console.log(pObj.gas);