const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_ATLAS, 
{ useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true  });
const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

module.exports = connection;