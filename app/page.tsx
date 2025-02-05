"use client";
import { closestCenter, DndContext, DragOverlay } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {arrayMove, SortableContext, verticalListSortingStrategy} from '@dnd-kit/sortable';

import { useState } from "react";

import { SortableItem } from "./Components/sortableItem";
import {StatBox} from "./Components/statBox";
import { Input } from "./Components/input";
import { InventoryItem } from "./inventoryItem";

export default function Home() {
  //const [activeId, setActiveId] = useState(null);
  // const [items, setItems] = useState(["Sword", "bow", "Bag"]);
  // const [ids, setIds] = useState([0, 1, 2]);
  const [items, setItems] = useState<InventoryItem[]>([])

  const addItem = (name: string) => {
    let id = (items.length + 1).toString()
    setItems([...items, {id, name}])
  }

  return (
    <div>
      <div>
        <StatBox value={10} />
        <StatBox value={10} />
        <StatBox value={10} />
        <StatBox value={10} />
        <StatBox value={10} />
        <StatBox value={10} />
      </div>
      <br/><br/>

      <Input addItem={addItem}></Input>
      <div>
        <DndContext 
          collisionDetection={closestCenter} 
          onDragEnd={handleDragEnd} 
          //onDragStart={handleDragStart}
          modifiers={[restrictToParentElement]}>
            
          <SortableContext
            items={items}
            strategy={verticalListSortingStrategy}>
            {items.map(item => <SortableItem key={item.id} data={item} />)}
          </SortableContext>

          {/* <DragOverlay>
            {activeId != null ? <Item id={activeId}> {items[activeId]} </Item>: null}
          </DragOverlay> */}
          
        </DndContext>
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
  



