let user = new Object();
let user2 = {};
user.name = "john";
user.surname = "smith";

console.log(user.name);

user.name = "pete";
console.log(user.name);

delete user.name;

console.log(user);

console.log( isEmpty(user) );
console.log( isEmpty(user2) );

function isEmpty(obj) {
    if (Object.keys(obj).length === 0) return true;
    else return false;
}

let menu = {
    "length": 10,
    "width": 20,
    "title": "My Menu"
}
console.log(`Menu before calling multiplyNumeric: ${JSON.stringify(menu)}`);

multiplyNumeric(menu);

console.log(`Menu after calling multiplyNumeric: ${JSON.stringify(menu)}`);

function multiplyNumeric(obj) {
    for (let key in obj) {
        if ( typeof(obj[key]) === 'number') {
            obj[key] *=2;
        }
    }
}

//Another Example!
const carObj = {
    model: "sedan",
    color: "red",
    year: "2020",

    drive: function() {
        console.log(`We are driving a ${sedan}`); //will give error because 'this' keyword is not used
        // 'this.sedan' works!
    },

    brake:  function() {
        console.log("We are slowing Down!")
    }
}

console.log(carObj.model)
console.log(carObj.color)

carObj.drive(); 
carObj.brake();


