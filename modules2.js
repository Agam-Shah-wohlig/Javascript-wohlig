import {add, square} from "./modules1.js";

console.log(add(2,3));
console.log(square(4,6));

/* 
There is no HTML file for this concept because it needs 
a proper server( like node.js sever) to run code related to modules.
*/

// Another rather more convenient way of importing.

import * as mod1 from "./modules1.js";

console.log(mod1.add(2,3));
console.log(mod2.square(4,6));