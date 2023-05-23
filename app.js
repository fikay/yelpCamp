const express = require('express')
const app = express()
const path = require('path')
const mongoose =  require('mongoose')


// access views folder and views engine
app.set('views', path.join(__dirname,'views'))
app.set('views engine','ejs')

//Listener for server
app.listen(3000, ()=>{
    console.log('listening')
})

