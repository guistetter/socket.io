const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

io.on('connect', socket => {
  console.log('a user has been connected... bomb has been droped')
  socket.emit('msg', {body: 'Olá fulano!'})
  setInterval(() => socket.emit('msg', {body:'server para client'}),2500)
  socket.on('msg', msg => console.log(msg))
})
app.set('view engine', 'ejs')

app.get('/', (req, res) => res.render('home'))

http.listen(3000, () =>{
  console.log('server running')
})