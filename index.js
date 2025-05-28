const dotenv = require('dotenv')
const mongoose = require('mongoose')
const express = require('express');
const app = express();
const PORT = 8080;
const cors = require('cors')
const bodyParser = require('body-parser');
const path = require('path')
app.use(bodyParser.urlencoded({extended:true}))
// const dbConnection = require("./Database/DbConnection")
const userRoutes = require("./Routes/userRoutes");
const styleRoutes = require("./Routes/StyleRoutes")
// dbConnection();
// app.use(express.json()); 
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/style/upload', express.static(path.join(__dirname, 'upload')));

app.use('/upload', express.static(path.join(__dirname, 'uploads')));

dotenv.config()
const mongoUrl = process.env.MONGO_URL;
const port = process.env.PORT;
try {
    mongoose.connect(mongoUrl)
    console.log("database connected");
    
} catch (error) {
    console.log(error);
    
}


app.use("/user",userRoutes)
app.use("/style",styleRoutes)


app.listen(PORT,()=>{
console.log(`listening on port ${PORT}`)
})