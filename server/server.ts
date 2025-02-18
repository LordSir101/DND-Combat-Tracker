import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

import { Server } from 'socket.io'
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})



io.on('connection', (socket) => {
  socket.on('start', () => {
    console.log('button clicked')
  })
})

  

server.listen(3001, 'localhost', () => {
  console.log('✔️ Server listening on port 3001')
})