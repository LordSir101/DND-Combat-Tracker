import { Socket } from "socket.io"

export class Party {
    host
    id
    members: Socket[] = []

    partyInfo = {}
    

    constructor(host: Socket, id: string) {
      this.host = host
      this.id = id

    }

    sendPlayerDataToParty(data) {
        for(let member of this.members) {
            member.emit('add-player-to-party', data)
        }

        this.host.emit('add-player-to-party', data)
    }

    addPlayerToParty(data, socket: Socket) {
        this.members.push(socket)

        let id = (Object.keys(this.partyInfo).length + 1).toString()
        this.partyInfo[id] = data

        socket.emit('recive-party-data', this.partyInfo)
    }

}