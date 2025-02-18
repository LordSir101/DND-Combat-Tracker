"use client";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

import { useState } from "react";

import { SortableItem } from "./Components/sortableItem";
import {StatBox} from "./Components/statBox";
import { Input } from "./Components/input";
import { InventoryItem } from "./inventoryItem";
import { io } from "socket.io-client";

const socket = io('http://localhost:3001')

export default function Home() {
  //const [activeId, setActiveId] = useState(null);
  // const [items, setItems] = useState(["Sword", "bow", "Bag"]);
  // const [ids, setIds] = useState([0, 1, 2]);
  const [items, setItems] = useState<InventoryItem[]>([])

  const addItem = (name: string) => {
    let id = (items.length + 1).toString()
    setItems([...items, {id, name}])
  }

  function handleClick() {
    socket.emit('start')
  }

  return (
    <div className="">
      
      <div className="m-4 mt-8 bg-slate-400 border-2 border-emerald-900 rounded-lg w-1/4 p-4 flex items-center">
        <div className="ml-2 flex items-center">
          <StatBox value={10} heading="STR" />
          <StatBox value={10} heading="DEX" />
          <StatBox value={10} heading="CON" />
          <StatBox value={10} heading="INT" />
          <StatBox value={10} heading="WIS" />
          <StatBox value={10} heading="CHA" />
        </div>
      </div>

      <br/><br/>

      <div className="mx-4 my-10">
        
        <div className="bg-slate-400 border-2 border-emerald-900 rounded-lg w-1/4 p-4">
          <h1 className="text-emerald-900 text-4xl font-bold mb-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)] pl-2">
            Inventory
          </h1>

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
        
      </div>

      <br/> <br/>
      <button className=" rounded-lg  bg-slate-100 w-20 mb-2" onClick={handleClick}> 
         <p className="mx-4">start</p>
      </button>
      
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
  



