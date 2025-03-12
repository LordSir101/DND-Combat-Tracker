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

  socket.on('join-party', (id, data, callback) => {
    const party = parties.get(id)

    if(party) {
      //let id = (Object.keys(this.partyInfo).length + 1).toString()
      //data.id = socket.id
      party.sendPlayerDataToParty(data)
      party.addPlayerToParty(data, socket)
      callback(id, data)
    }
    else {
      callback(undefined, data)
    }
  })
})

server.listen(3001, 'localhost', () => {
  console.log('✔️ Server listening on port 3001')
})