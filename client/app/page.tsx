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
import { Socket } from "node:dgram";

const socket = io('http://localhost:3001')

export default function Home() {
  //const [activeId, setActiveId] = useState(null);
  // const [items, setItems] = useState(["Sword", "bow", "Bag"]);
  // const [ids, setIds] = useState([0, 1, 2]);
  const [items, setItems] = useState<InventoryItem[]>([])
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([])

  const [hp, setHp] = useState(10)
  const [lvl, setLvl] = useState(1)
  const [name, setName] = useState('Player')
  const [inParty, setInparty] = useState(false)
  const [partyId, setPartyId] = useState<number | undefined> (undefined)

  const addItem = (name: string) => {
    let id = (items.length + 1).toString()
    setItems([...items, {id, name}])
  }

  const addPartyMember = (name: string, hp: number) => {
    let id = (partyMembers.length + 1).toString()
    setPartyMembers([...partyMembers, {id, name, hp}])
  }

  function handleNameChange(e:any) {
    setName(e.target.value)
  }

  function createParty() {
    console.log('create pressed')
    socket.emit('create-party', showParty)
  }

  function showParty(idOfParty: number) {
    setPartyId(idOfParty)
    setInparty(true)
  }

  function joinParty() {
    socket.emit('join-party', name, hp, addSelfToParty)
  }

  function addSelfToParty(idOfParty: number, data: PartyMember) {
    showParty(idOfParty)
    //addPlayerToParty(data)
  }

  function addPlayerToParty( data: PartyMember) {
    addPartyMember(data.name, data.hp)
  }
  // socket.on('add-player-to-party', (data) => {
  //   console.log("added")
  //   addPlayerToParty(data)
  // })

  useEffect(() => {
    socket.on('add-player-to-party', (data) => {
      console.log("added")
      addPlayerToParty(data)
    })

    socket.on('recive-party-data', (partyData) => {
      console.log("data recived on client")
      console.log(partyData)
      let temp = []
      for (let key in partyData) {
        console.log(partyData[key])
        let id = (temp.length + 1).toString()
        partyData[key].id = id
        temp.push(partyData[key])
        //addPlayerToParty(partyData[key])
      }
      setPartyMembers(temp)
    })

    return () => {
      socket.off('add-player-to-party')
      socket.off('recive-party-data')
    }
  }, [partyMembers])

  
  function debugValue() {
    console.log(name)
  }
  

  return (
    <div className="flex items-start">
      
      <div className="w-2/3">
        <div className="m-4 mt-8 bg-slate-400 border-2 border-emerald-900 rounded-lg w-1/2 p-4 flex items-center justify-evenly">
          <div className="ml-2 flex items-center">
            <p>Name: </p>
            <input placeholder={name} type="text" onChange={handleNameChange}></input>
          </div>
          <div className="ml-2 flex items-center">
            <StatBox value={lvl} heading="LVL" updateValue={setLvl}/>
            <StatBox value={hp} heading="HP" updateValue={setHp}/>
          </div>
        </div>

        <br/>

        <div className="m-4 mt-8 bg-slate-400 border-2 border-emerald-900 rounded-lg w-1/2 p-4 flex items-center justify-evenly">
            <StatBox value={10} heading="STR" />
            <StatBox value={10} heading="DEX" />
            <StatBox value={10} heading="CON" />
            <StatBox value={10} heading="INT" />
            <StatBox value={10} heading="WIS" />
            <StatBox value={10} heading="CHA" />
          
          {/* <div className="ml-2 flex items-center">
            
          </div> */}
        </div>

        <br/><br/>

        <div className="mx-4 my-10 bg-slate-400 border-2 border-emerald-900 rounded-lg w-1/2 p-4">
          <div className="flex justify-center">
            <h1 className="text-emerald-900 text-4xl font-bold mb-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] pl-2">
              Inventory
            </h1>
          </div>
         

          <Input addItem={addItem}></Input>

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
            
            
            

            {/* <DragOverlay>
              {activeId != null ? <Item id={activeId}> {items[activeId]} </Item>: null}
            </DragOverlay> */}
            
          </DndContext>

        </div>

        {/* <div className="mx-4 my-10">
          
         
          
        </div> */}

        <br/> <br/>
        <button className=" rounded-lg  bg-slate-100 w-20 mb-2" onClick={createParty}> 
          <p className="mx-4">Create Party</p>
        </button>
        <button className=" rounded-lg  bg-slate-100 w-20 mb-2" onClick={joinParty}> 
          <p className="mx-4">Join Party</p>
        </button>
        <button className=" rounded-lg  bg-slate-100 w-20 mb-2" onClick={debugValue}> 
          <p className="mx-4">DEBUG</p>
        </button>

      </div>
      
      <div className="w-1/3">
        {
          inParty?

          <div className="m-4 mt-8 bg-slate-400 border-2 border-emerald-900 rounded-lg w-6/7 p-4 ">
            
            <div className="flex justify-center">
              <h1 className="text-emerald-900 text-4xl font-bold mb-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] pl-2">
                Party Info
              </h1>
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
            

            {/* <DragOverlay>
              {activeId != null ? <Item id={activeId}> {items[activeId]} </Item>: null}
            </DragOverlay> */}
            
          </DndContext>
          </div>
        :

        <div></div>
        }
      </div>
      
      
      
    </div>
    
   
  );
  
  // function handleDragStart(event: { active: any;}) {
  //   const {active} = event;
    
  //   setActiveId(active.id);
  // }

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
  



