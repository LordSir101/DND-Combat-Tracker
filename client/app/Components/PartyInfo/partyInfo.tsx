import { Socket } from "socket.io-client"
import { PartyMember} from "@/app/types"
import { useEffect, useState } from "react"
import { getLocalData } from "@/app/utils"
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';
import { PartyMemberInfo } from "./partyMemberInfo"
import { EventEmitterBtn } from "../eventEmitterBtn"
type PartyInfo = {
    socket: Socket
    isHost: boolean
    partyId: string | undefined
    startTrade: (id:string) => void
}

const getMemberPos = (items: PartyMember[], id: string) => {
    return items.findIndex((item) => item.id === id);
}

export function PartyInfo(props: PartyInfo) {
    const [partyMembers, setPartyMembers] = useState<PartyMember[]>([])
    // const [partyId, setPartyId] = useState<string| undefined> (undefined)
    // const [inParty, setInparty] = useState(false)
    // const [isHost, setIsHost] = useState(false)

    const addPartyMember = (data: PartyMember) => {
        console.log(data.id)
        setPartyMembers(partyMembers => [...partyMembers, data])
      }
    
      const updateMemberData = (memberData: PartyMember) => {
        let indexOfMember = getMemberPos(partyMembers, memberData.id)
        console.log("updated data id " ,memberData.id)
        console.log("index", indexOfMember)
        let newMemberData = partyMembers
        newMemberData[indexOfMember] = memberData
        setPartyMembers([...newMemberData])
      }
    
    
    //   function createParty() {
    //     props.socket.emit('create-party', showParty)
    //     setIsHost(true)
    //   }
    
    //   function joinParty(idOfParty: string) {
    //     props.socket.emit('join-party',idOfParty, playerData, showParty)
    //     setIsHost(false)
    //   }
    
    //   function showParty(idOfParty: string) {
    //     if(idOfParty) {
    //       setPartyId(idOfParty)
    //       setInparty(true)
    //       setPartyJoinError(null)
    //     }
    //     else {
    //       setPartyJoinError('The party ID does not exist')
    //     }
    //   }
    
    useEffect(() => {
        props.socket.on('add-player-to-party', (data) => {
          addPartyMember(data)
        })
    
        props.socket.on('recive-party-data', (partyData) => {
          let temp = []
    
          for (let key in partyData) {
            temp.push(partyData[key])
          }
    
          setPartyMembers(temp)
        })
    
        props.socket.on('update-party-member-data', (memberData) => {
          updateMemberData(memberData)
        })
    
        props.socket.on('update-party-order', (memberDataArr) => {
          console.log(memberDataArr)
          setPartyMembers([...memberDataArr])
        })
    
        return () => {
            props.socket.off('add-player-to-party')
            props.socket.off('recive-party-data')
            props.socket.off('update-party-member-data')
            props.socket.off('update-party-order')
        }
      }, [partyMembers]) //partyMembers

    return (
        <div className="borderBox m-4 mt-8 w-6/7">
            
            <div className="flex justify-center">
                <h1>
                Party Info
                </h1>
            </div>

            <div className="flex justify-center">
                {
                props.partyId ? 
                    <div className="flex items-center">
                        <span className="inline-flex items-center py-2.5 px-4 text-center text-lg font-bold">Party ID:</span>
                        <input id="PartyID" value={props.partyId} className="border-none bg-transparent w-1/3 " readOnly disabled></input> 
                        <button onClick={() => {props.partyId ? navigator.clipboard.writeText(props.partyId) : '' }} className="submitButton">
                        <span id="default-message">Copy</span>
                        </button>

                    </div>
                :
                    <h2>
                    Party not joined
                    </h2>
                }
            </div>

            <DndContext 
                collisionDetection={closestCenter} 
                // onDragEnd={handleDragEndParty} 
                //onDragStart={handleDragStart}
                modifiers={[restrictToParentElement]}>
                
                <ul>
                <SortableContext
                    items={partyMembers}
                    strategy={verticalListSortingStrategy}>
                    {partyMembers.map(member => <PartyMemberInfo key={member.id} data={member} clientID={props.socket.id} handleTrade={props.startTrade}/>)}
                </SortableContext>

                </ul>            
            </DndContext>
            {
                props.partyId && props.isHost ? 
                <EventEmitterBtn socket={props.socket} emitMessage={"roll-initiative-auto"} btnText={"Roll Initiative (automatic)"}/>
                :
                <div></div>
            }

        </div>
    )

}