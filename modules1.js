

export const name = "Agam";
export function add(a, b) {
    return a+b;
}
export function square(n1, n2) {
    return add(n1,n2) * add (n1,n2)
}

// another way of Exporting 
export default function() {
    //function code!
}
/* **Important** : There can be only one default export in a module as it doesnot need the same name to call
Case1: The above function do not have name so we can use anyname to import it.
Case2: Image the above function has name greet() but while importing this default export 
       function we can use import hello from "./modules1.js". name do not need to be same. */
