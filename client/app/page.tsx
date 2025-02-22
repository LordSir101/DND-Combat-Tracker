"use client";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

import { useEffect, useState } from "react";

import { SortableItem } from "./Components/sortableItem";
import { PartyMemberInfo } from "./Components/partyMemberInfo";
import {StatBox} from "./Components/statBox";
import { Input } from "./Components/input";
import { InventoryItem, PartyMember } from "./types";
import { io } from "socket.io-client";
import { EventEmitterBtn } from "./Components/rollInitiativeBtn";
import { StatusBox } from "./Components/statusBox";

const socket = io('http://localhost:3001')

export default function Home() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [statuses, setStatuses] = useState<string[]>(["blinded", "grappled", "charmed", "frightened", "invisible"])
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([])
  const [partyJoinError, setPartyJoinError] = useState<string | null>(null)

  const [hp, setHp] = useState(10)
  const [lvl, setLvl] = useState(1)
  const [init, setInit] = useState(0)
  const [name, setName] = useState('Player')
  const [inParty, setInparty] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [partyId, setPartyId] = useState<number | undefined> (undefined)

  let playerData = {
    name,
    hp,
    init,
    statuses
  }

  const addItem = (name: string) => {
    let id = (items.length + 1).toString()
    setItems([...items, {id, name}])
  }

  const addPartyMember = (data: PartyMember) => {
    console.log(data)
    setPartyMembers([...partyMembers, data])
  }

  const updateMemberData = (memberData: PartyMember) => {
    let indexOfMember = getMemberPos(partyMembers, memberData.id)
    let newMemberData = partyMembers
    newMemberData[indexOfMember] = memberData
    setPartyMembers([...newMemberData])
  }

  function handleNameChange(e:any) {
    setName(e.target.value)
  }

  function createParty() {
    socket.emit('create-party', showParty)
    setIsHost(true)
  }

  function joinParty(idOfParty: string) {
    socket.emit('join-party',idOfParty, playerData, showParty)
    setIsHost(false)
  }

  function showParty(idOfParty: number) {
    if(idOfParty) {
      setPartyId(idOfParty)
      setInparty(true)
      setPartyJoinError(null)
    }
    else {
      setPartyJoinError('The party ID does not exist')
    }
  }

  useEffect(() => {
    socket.on('add-player-to-party', (data) => {
      addPartyMember(data)
    })

    socket.on('recive-party-data', (partyData) => {
      let temp = []

      for (let key in partyData) {
        temp.push(partyData[key])
      }

      setPartyMembers(temp)
    })

    socket.on('update-party-member-data', (memberData) => {
      updateMemberData(memberData)
    })

    socket.on('update-party-order', (memberDataArr) => {
      console.log(memberDataArr)
      setPartyMembers([...memberDataArr])
    })

    return () => {
      socket.off('add-player-to-party')
      socket.off('recive-party-data')
      socket.off('update-party-member-data')
      socket.off('update-party-order')
    }
  }, [partyMembers])

  
  function debugValue() {
    console.log(name)
  }

  // send player data to party whenever any of the relevant stats change
  useEffect(() => {
    socket.emit("update-player-data", playerData)

  }, [hp, name, init, statuses])
  

  return (
    <div className="flex items-start">
      
      <div className="w-1/3">
        <div className="borderBox m-4 mt-8 flex items-center justify-evenly">
          <div className="ml-2 flex items-center">
            <h1>Name: </h1>
            <input className="mx-2" placeholder={name} type="text" onChange={handleNameChange}></input>
          </div>
          <div className="ml-2 flex items-center">
            <StatBox value={lvl} heading="LVL" updateValue={setLvl}/>
            <StatBox value={hp} heading="HP" updateValue={setHp}/>
            <StatBox value={init} heading="INIT" updateValue={setInit}/>
          </div>
        </div>

        <br/>

        <div className="borderBox  m-4 mt-8 flex items-center justify-evenly">
            <StatBox value={10} heading="STR" />
            <StatBox value={10} heading="DEX" />
            <StatBox value={10} heading="CON" />
            <StatBox value={10} heading="INT" />
            <StatBox value={10} heading="WIS" />
            <StatBox value={10} heading="CHA" />
        </div>

        <br/><br/>

        <div className="borderBox mx-4 my-10">
          <div className="flex justify-center">
            <h1>
              Inventory
            </h1>
          </div>
          <div className="flex justify-center space-x-2 mb-2 rounded-lg  bg-slate-100 w-full py-2">
            <div className="w-1/2">
              <Input onSubmit={addItem} buttonText="add"></Input>
            </div>
            
          </div>
          
          <DndContext 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd} 
            //onDragStart={handleDragStart}
            modifiers={[restrictToParentElement]}>
              
            <ul>
              <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}>
                {items.map(item => <SortableItem key={item.id} data={item} />)}
              </SortableContext>

            </ul>
            
          </DndContext>

        </div>

        <br/> <br/>

        <div className="flex items-center mx-4 justify-evenly">

          <button className="submitButton " onClick={createParty} disabled={inParty}> 
            <p className="mx-4">Create Party</p>
          </button>

          <div className="w-1/2">
            <Input onSubmit={joinParty} buttonText="Join Party" disabled={inParty} inputClass="w-1/2 mx-2" buttonClass="w-1/3"></Input>
          </div>

          <p className="text-white text-center">
            {
              partyJoinError ? partyJoinError : ''
            }
          </p>

        </div>
        <div className="mx-4 w-1/2 items-center">
          
        </div>
        
        <br/> <br/>

        <button className="submitButton" onClick={debugValue}> 
          <p className="mx-4">DEBUG</p>
        </button>

      </div>
      <div className="borderBox mx-4 mt-8 w-1/3 ">
        <div className="flex justify-center">
          <h1>
            Statuses
          </h1>
        </div>

        <div className="grid grid-cols-5">
            {statuses.map((status, i) => <StatusBox key={i} statusName={status}/>)}
        </div>
      
      </div>
      
      <div className="w-1/3">
        <div className="borderBox m-4 mt-8 w-6/7">
          
          <div className="flex justify-center">
            <h1>
              Party Info
            </h1>
          </div>

          <div className="flex justify-center">
            {
              partyId ? 
                <h2>
                  Party ID: {partyId}
                </h2>
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
                {partyMembers.map(member => <PartyMemberInfo key={member.id} data={member} />)}
              </SortableContext>

            </ul>            
          </DndContext>
          {
            partyId && isHost ? 
              <EventEmitterBtn socket={socket} emitMessage={"roll-initiative-auto"} btnText={"Roll Initiative (automatic)"}/>
            :
              <div></div>
          }

        </div>
      </div>

    </div>
   
  );
  
  function handleDragEnd(event: { active: any; over: any; }) {
    const {active, over} = event;
    
    // active id is key of first item
    // over id is key of item in new location
    // we set key = item id

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = getItemPos(items, active.id.toString());
        const newIndex = getItemPos(items, over.id.toString());
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

}

const getItemPos = (items: InventoryItem[], id: string) => {
  return items.findIndex((item) => item.id === id);
}

const getMemberPos = (items: PartyMember[], id: string) => {
  return items.findIndex((item) => item.id === id);
}
  



