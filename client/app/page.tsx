"use client";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

import { useEffect, useLayoutEffect, useState } from "react";

import { SortableItem } from "./Components/sortableItem";
import { PartyMemberInfo } from "./Components/partyMemberInfo";
import {StatBox} from "./Components/statBox";
import { Input } from "./Components/input";
import { InventoryItem, PartyMember, Status } from "./types";
import { io } from "socket.io-client";
import { EventEmitterBtn } from "./Components/rollInitiativeBtn";
import { StatusBox } from "./Components/statusBox";
import { statusVisuals } from "./statusVisuals";

import { v4 as uuidv4 } from 'uuid';

const socket = io('http://localhost:3001')

export default function Home() {
  const [items, setItems] = useState<InventoryItem[]>(getLocalData("items") || [])
  // const [statuses, setStatuses] = useState<string[]>([])
  const [statuses, setStatuses] = useState<Status[]>(getLocalData("statuses") ||[])
  const [partyMembers, setPartyMembers] = useState<PartyMember[]>([])
  const [partyJoinError, setPartyJoinError] = useState<string | null>(null)

  const [hp, setHp] = useState(getLocalData("hp") ||10)
  const [lvl, setLvl] = useState(1)
  const [init, setInit] = useState(getLocalData("init") || 0)
  const [name, setName] = useState(getLocalData("name") ||'Player')
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const [inParty, setInparty] = useState(false)
  const [isHost, setIsHost] = useState(false)
  const [partyId, setPartyId] = useState<string| undefined> (undefined)

  let playerData = {
    name,
    hp,
    init,
    statuses
  }

  let localData = {
    name,
    hp,
    init,
    statuses,
    items
  }

  const addItem = (name: string) => {
    let id = (items.length + 1).toString()
    setItems([...items, {id, name, quantity:1}])
  }

  const removeItem = (id: string) => {
    let index = items.findIndex((item) => item.id === id);
    let newItems = items
    newItems.splice(index, 1)
    setItems([...newItems])
  }

  const updateItem = (id: string, description:string | undefined, quantity: number) => {
    let index = items.findIndex((item) => item.id === id);
    let newItems = items
    newItems[index].description = description
    newItems[index].quantity = quantity
    setItems([...newItems])
  }

  const addStatus = (id:string, status: string, option: string) => {
    setStatuses([...statuses, {id, status, option}])
  }

  // remove status from applied statuses
  const removeStatus = (id:string) => {
    let index = statuses.findIndex((status) => status.id === id);
    let newStatuses = statuses
    newStatuses.splice(index, 1)
    setStatuses([...newStatuses])
  }

  // update the option selected on statuses with options
  const changeStatusOption = (id:string, option:string) => {
    let index = statuses.findIndex((status) => status.id === id);
    let newStatuses = statuses
    console.log("chgange", option)
    newStatuses[index].option = option
    setStatuses([...newStatuses])
  }

  const toggleStatusMenu = () => {
    setShowStatusMenu(!showStatusMenu)
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


  function createParty() {
    socket.emit('create-party', showParty)
    setIsHost(true)
  }

  function joinParty(idOfParty: string) {
    socket.emit('join-party',idOfParty, playerData, showParty)
    setIsHost(false)
  }

  function showParty(idOfParty: string) {
    if(idOfParty) {
      setPartyId(idOfParty)
      setInparty(true)
      setPartyJoinError(null)
    }
    else {
      setPartyJoinError('The party ID does not exist')
    }
  }

  function saveLocalData(data:any) {
    localStorage.setItem("playerData", JSON.stringify(data));
  }

  function getLocalData(key:string) {
    // let data = localStorage.getItem("playerData")
    // if(data){
    //   let dataObj = JSON.parse(data)

    //   // setHp(dataObj.hp)
    //   // setName(dataObj.name)
    //   // setInit(dataObj.init)
    //   // setStatuses([...dataObj.statuses])
    //   // setItems([...dataObj.items])
    //   return dataObj[key]
    // }

    return null
    
  }


  // useLayoutEffect(() => {
  //     getLocalData();
  //   }, []);

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
    //saveLocalData(localData)

  }, [hp, name, init, statuses])

  useEffect(() => {
    //saveLocalData(localData)

  }, [items])
  

  return (
    <div className="flex items-start">
      
      <div className="w-1/3">
        <div className="borderBox flex-col m-4 mt-8">
          <div className=" flex items-center justify-evenly">
            <div className="ml-2 flex-col items-center">
              <h1 className="text-center ">{name}</h1>
              <Input onSubmit={setName} buttonClass="w-2/6" buttonText="Change"></Input>
            </div>
            <div className="ml-2 flex items-center">
              <StatBox value={lvl} heading="LVL" updateValue={setLvl}/>
              <StatBox value={hp} heading="HP" updateValue={setHp}/>
              <StatBox value={init} heading="INIT" updateValue={setInit}/>
            </div>
          </div>

          <div>
              <div className=" m-4 mt-8 flex items-center justify-evenly">
                <StatBox value={10} heading="STR" />
                <StatBox value={10} heading="DEX" />
                <StatBox value={10} heading="CON" />
                <StatBox value={10} heading="INT" />
                <StatBox value={10} heading="WIS" />
                <StatBox value={10} heading="CHA" />
            </div>
          </div>

          <div className="flex items-center mx-4 mt-12 justify-evenly">

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

        </div>

        <div className="borderBox mx-4 my-4">
          <div className="flex justify-center">
            <h1>
              Inventory
            </h1>
          </div>
          <div className="flex justify-center space-x-2 mb-2 rounded-lg  bg-slate-100 w-full py-2">
            <div className="w-1/2">
              <Input onSubmit={addItem} buttonText="Add"></Input>
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
                {items.map(item => <SortableItem key={item.id} data={item} updateData={updateItem} removeItem={removeItem}/>)}
              </SortableContext>

            </ul>
            
          </DndContext>

        </div>

        <br/> <br/>

        
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
        
        {/* Display currently applied statuses */}
        <div className="grid grid-cols-5">
            {
              statuses.map((status, i) => { 
                let key = status.status as keyof typeof statusVisuals
                let options = "options" in statusVisuals[key] ? statusVisuals[key]["options"] : undefined
                return <StatusBox key={i} id={status.id} statusName={status.status} optionChanged={changeStatusOption} removeStatus={removeStatus} selectedOption={status.option} options={options}/>
              })
            }
        </div>
        <br/> <br/>
        <button className="submitButton" onClick={toggleStatusMenu}>Add Status</button>
        {
            showStatusMenu ?

            <div className='ml-6 mr-4 my-2 grid grid-cols-5'>
  
              {/* Check which statuses are not applied, the display those as selectable*/}
              
              {Object.keys(statusVisuals).reduce((unusedStatuses: any[], statusKey:string, i) => {
                let key = statusKey as keyof typeof statusVisuals
                let id = uuidv4();
                let exists = statuses.findIndex((status) => status.status === statusKey);

                // always show statuses that have options so they can be added multiple times
                if(!(exists > 0) || statusVisuals[key].options.length > 0) {
                  
                  let initialOption = statusVisuals[key].options[0]
                  unusedStatuses.push(
                  <button key={i} onClick={()=>addStatus(id, statusKey, initialOption)}>
                    <StatusBox id={id} statusName={statusKey}/>
                  </button>

                  )
                }
                return unusedStatuses

              }, [])}

            </div>

            :

            <div></div>
        }
      
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
                  <div className="flex items-center">
                    <span className="inline-flex items-center py-2.5 px-4 text-center text-lg font-bold">Party ID:</span>
                    <input id="PartyID" value={partyId} className="border-none bg-transparent w-1/3 " readOnly disabled></input> 
                    <button onClick={() => {navigator.clipboard.writeText(partyId)}} className="submitButton">
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
  