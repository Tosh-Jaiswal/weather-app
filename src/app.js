const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

//Deifne path for express confiq
const publicDirectoryPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const utilsPath = path.join(__dirname, '../utils')

//setup handelbars engine and views locATION
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//SETup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index.hbs', {
        title: 'Weather App',
        name: 'Tosh'
    })
})
app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About me',
        name: 'Tosh'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helptext: 'This is some helpful text',
        title: 'Help',
        name: 'Tosh'
    })
})
app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error:'You must provide and address'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location}={}) => {
        if(error) {
            return res.send({error}) //or error : error
        }

        forecast(latitude, longitude, (error, forecastData) => {
         if(error){
             return res.send({error})
         }   
         res.send({
             forecast: forecastData,
             location,
             address: req.query.address
         })

        })
    })
    // res.send({
    //     Forecast:'Its raining',
    //     Temperature:'50dc',
    //     address:req.query.address
    // })
})

app.get('/help/*', (req,res) => {
    res.render('404',{
        title:'404',
        name:'tosh',
        errorPage:'Help artical not found'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        title:'404',
        name:'tosh',
        errorPage:'404 PAGE FOUND!'
    })
})
app.listen(3000, () => {
    console.log('Server is up on port 3000')
})