import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)

import { Server } from 'socket.io'
import { generateId } from "./generateId.ts";

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

import { Party } from './party.ts'

const parties: Map<string, Party> = new Map()

io.on('connection', (socket) => {

  socket.on('create-party', (callback) => {
    let id =  generateId()
    parties.set(id, new Party(socket, id))

    callback(id)
  })

  socket.on('join-party', (id, name, hp, callback) => {
    const party = parties.get(id)

    if(party) {
      party.sendPlayerDataToParty({name, hp})
      party.addPlayerToParty({name, hp}, socket)
      callback(id, {name, hp})
    }
    else {
      callback(undefined, {name, hp})
    }
  })
})

server.listen(3001, 'localhost', () => {
  console.log('✔️ Server listening on port 3001')
})