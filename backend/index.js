const express = require("express");
const { userRouter,router } = require("./routes");
const cors = require('cors');
const app = express();
const jwt = require('jsonwebtoken'); 
const { accountRouter } = require("./routes/account");

app.use(cors());

app.use(express.json());

app.use("/api/v1",router)
app.use("/api/v1/user",userRouter);
app.use("/api/v1/account",accountRouter);



app.listen(3000);




