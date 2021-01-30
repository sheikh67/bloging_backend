const app = require('./app');
const PORT = process.env.PORT || 4000

async function init(){
    app.listen(PORT, function() {
        console.log("Server is running on Port: " + PORT);
    });
}

init();