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

const streams = {}
const createStream = term => {
  const stream = T.stream('statuses/filter', {track: term})
  stream.on('error', req => console.log(req))
  stream.on('tweet', tweet => {
    console.log(tweet.user.name, tweet.text)
    io.to(term).emit('tweet',{
      username: tweet.user.name,
      text: tweet.text,
      term
    })
  })
  streams[term] = stream
}

const checkStreams = () => {
  //filtrar e desconectar sala inexistentes
  const terms = Object.keys(streams)
  terms
  .filter( t => (!(t in io.sockets.adapter.rooms )))
  .map( t => {
    streams[t].stop()
    delete streams[t]
  })
}

io.on('connection',socket => {
  console.log(socket.id)
  //socket.join('minhaSala')
  socket.on('startStream', term => {
    if(!(term in streams)){
      createStream(term)
      //streams[term] = 'opa'
    }
    socket.join(term)
    //console.log('startStream', term, streams)
  })
  console.log(io.sockets.adapter.rooms)
  socket.on('disconnect', reason =>{
    checkStreams()
    console.log(streams)
    //console.log(reason)
    //console.log(io.sockets.adapter.rooms)
  })
})

//stream estatico
// const stream = T.stream('statuses/filter', {track: '#akali'})
// stream.on('error', req => console.log(req))
// stream.on('tweet', tweet => {
//   console.log(tweet.user.name, tweet.text)
//   io.emit('tweet',{
//     username: tweet.user.name,
//     text: tweet.text
//   })
// })

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