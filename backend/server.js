const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./routers/userRoutes");
// const postRouter = require("./routers/postRoutes")
const mongoDB = require("./config/db")
dotenv.config();


const app = express();

app.use(express.json());
// Configure CORS properly
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true, // Allow credentials
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use("/auth",router);
// app.use("/auth",postRouter);

const PORT = process.env.PORT
app.listen(PORT,()=>{
    mongoDB();
    console.log(`Server is running on ${PORT}`)
})