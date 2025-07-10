const express = require("express");
const dotenv = require("dotenv");
const router = require("./routers/userRoutes")
const mongoDB = require("./config/db")
dotenv.config();


const app = express();

app.use(express.json());

app.use("/auth",router);

const PORT = process.env.PORT
app.listen(PORT,()=>{
    mongoDB();
    console.log(`Server is running on ${PORT}`)
})