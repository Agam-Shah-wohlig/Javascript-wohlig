const mongoose = require("mongoose");

//Conenction to Mongo DB
async function connectMongoDB(url){
    return mongoose.connect(url);
}

module.exports = {
    connectMongoDB
};
