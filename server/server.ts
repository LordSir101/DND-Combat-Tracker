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

import { Party } from './party.ts'

let parties: Party[] = []

io.on('connection', (socket) => {
  socket.on('create-party', (callback) => {
    let id: number = 0
    parties.push(new Party(socket, id))

    callback(id)
    console.log('Party Created')
  })

  socket.on('join-party', (name, hp, callback) => {
    parties[0].sendPlayerDataToParty({name, hp})
    parties[0].addPlayerToParty({name, hp}, socket)
    
    let id: number = 0
    callback(id, {name, hp})
  })
})

  

server.listen(3001, 'localhost', () => {
  console.log('✔️ Server listening on port 3001')
})