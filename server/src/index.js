const app = require('./app')
const port = process.env.PORT;

//Initiating Express Server
app.listen(port, ()=> {
    console.log("Server is up on port:", port);
});