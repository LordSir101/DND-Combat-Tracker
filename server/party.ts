import { Socket } from "socket.io"
import { rollDice } from "./utils"

export class Party {
    host
    partyId
    members: Socket[] = []

    partyInfo = {}
    

    constructor(host: Socket, id: string) {
      this.host = host
      this.partyId = id

      this.host.on('roll-initiative-auto', () => {
        this.rollInitiativeAuto()
      })

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

    rollInitiativeAuto() {
        let partyRolls: number[] = []
        let memberDataArray:any = []

        for(let member of this.members) {
            let roll = rollDice(20)[0] + Number(this.partyInfo[member.id].init)

            // console.log(member.id, this.partyInfo[member.id].name, this.partyInfo[member.id].init, roll)
            // console.log("----------------------------------")
            
            // check for first item in arr
            if(partyRolls.length > 0) {
                for(let i = 0; i < partyRolls.length; i++) {
                    // loop through array until we fin a roll that is lower than current roll
                    if(roll >= partyRolls[i]) {
                        // add current roll (higher) before roll in array (lower)
                        partyRolls.splice(i, 0, roll)
                        memberDataArray.splice(i, 0, this.partyInfo[member.id])
                        break
                    }

                    // if current roll is lowest
                    if(i == partyRolls.length -1) {
                        partyRolls.push(roll)
                        memberDataArray.push(this.partyInfo[member.id])
                        break
                    }
                }
            }
            else {
                partyRolls.push(roll)
                memberDataArray.push(this.partyInfo[member.id])
            }
        }

        // send new member array with data to all clients
        this.emitDataToAll('update-party-order', memberDataArray)

        // console.log(partyRolls)
        // console.log(memberDataArray)
    }

}