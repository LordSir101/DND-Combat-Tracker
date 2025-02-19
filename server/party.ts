import { Socket } from "socket.io"

export class Party {
    host
    partyId
    members: Socket[] = []

    partyInfo = {}
    

    constructor(host: Socket, id: string) {
      this.host = host
      this.partyId = id

    }

    sendPlayerDataToParty(data) {
        this.emitDataToAll('add-player-to-party', data)
    }

    addPlayerToParty(data, socket: Socket) {
        this.members.push(socket)
        this.partyInfo[socket.id] = data

        socket.on('update-player-data', (data) => {
            this.updateMemberData(data, socket.id)
        })

        socket.emit('recive-party-data', this.partyInfo)
    }

    updateMemberData(data, socketID) {
        this.partyInfo[socketID] = data
        this.partyInfo[socketID].id = socketID
        this.emitDataToAll('update-party-member-data', data)
    }

    emitDataToAll(event, data) {
        for(let member of this.members) {
            member.emit(event, data)
        }

        this.host.emit(event, data)
    }

}