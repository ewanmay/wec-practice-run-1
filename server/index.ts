const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
})

const PORT = process.env.PORT || 5000


io.on('connection', (socket) => {
  console.log('User Connected')


  socket.on('hello', () => {
    console.log('got hello from client')
    socket.emit('hello-response')
  })
  

  socket.on('disconnect', () => {
  })
})

http.listen(PORT, () => console.log(`Listening on port ${PORT}`))
