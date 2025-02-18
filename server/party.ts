import { Socket } from "socket.io"

export class Party {
    host
    id
    members: Socket[] = []

    partyInfo = {}
    

    constructor(host: Socket, id: number) {
      this.host = host
      this.id = id

    }

    sendPlayerDataToParty(data) {
        // let id = (Object.keys(this.partyInfo).length + 1).toString()
        // this.partyInfo[id] = data

        for(let member of this.members) {
            member.emit('add-player-to-party', data)

        }

        this.host.emit('add-player-to-party', data)
    }

    addPlayerToParty(data, socket: Socket) {
        console.log("reciveing data")
        this.members.push(socket)
        let id = (Object.keys(this.partyInfo).length + 1).toString()
        this.partyInfo[id] = data
        
        socket.emit('recive-party-data', this.partyInfo)

        
    }

}