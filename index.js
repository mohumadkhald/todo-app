const express = require('express')
require('dotenv')
const morgan = require('morgan')
const userRoutes = require('./routes/userRoutes')
const todosRoutes = require('./routes/todosRoutes')
const app = express()
const port = 3000
const mongoose = require('mongoose');
var cors = require('cors')
// app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded())
app.use(morgan("tiny"))

app.use(cors())
app.use('/users', userRoutes)
app.use("/todos", todosRoutes);

mongoose.connect(process.env.Mongo_Url)
.then(() => console.log('meow'))
.catch(err => console.log('error Database'));


app.use((err,req,res,next)=>{
  const statusCode = err?.statusCode || 500;
  res.status(statusCode).send({
    statusCode,message: err?.message || "Internal Server Error",
    errors: err?.errors || []
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})