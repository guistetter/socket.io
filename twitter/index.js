const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const Twit = require('twit')
require('dotenv/config')

const port = process.env.PORT || 3000 
const T = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60*1000
})

const stream = T.stream('statuses/filter', {track: '#apple'})
stream.on('tweet', tweet => {
  console.log(tweet)
})

app.set('view engine', 'ejs')
app.get('/', (req, res) => {
  res.render('home')
})
http.listen(port, err => {
  if(err){
    console.log(err)
  } else {
    console.log('Server running....')
  }
})