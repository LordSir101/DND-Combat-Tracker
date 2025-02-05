"use client";
import { closestCenter, DndContext, DragOverlay, useDraggable, useDroppable } from "@dnd-kit/core";
import {arrayMove, SortableContext, useSortable, verticalListSortingStrategy} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import Image from "next/image";
import { forwardRef, useState } from "react";

export default function Home() {
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState(["Sword", "bow", "Bag"]);
  const [ids, setIds] = useState([0, 1, 2]);

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

      <div>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
          <SortableContext
          items={ids}
          strategy={verticalListSortingStrategy}>
          {ids.map(id => <SortableItem key={id} id={id} name={items[id]} />)}
            
          </SortableContext>

          <DragOverlay>
            {activeId != null ? <Item id={activeId}> {items[activeId]} </Item>: null}
          </DragOverlay>
          
        </DndContext>
      </div>
      
    </div>
    
   
  );
  
  function handleDragStart(event: { active: any;}) {
    const {active} = event;
    
    setActiveId(active.id);
  }

  function handleDragEnd(event: { active: any; over: any; }) {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setIds((ids) => {
        const oldIndex = ids.indexOf(active.id);
        const newIndex = ids.indexOf(over.id);
        
        return arrayMove(ids, oldIndex, newIndex);
      });
    }
  }
}

type StatBoxProps = {
  value: number;
};

function StatBox({value}: StatBoxProps) {
  return (
    <input className="statBox" defaultValue={value} type="number" name="points" step="1" max="20" min="0" />
  )
}

function Inventory() {
  const {setNodeRef} = useDroppable({
    id: 'inventory',
  });
  
  return (
    <div ref={setNodeRef}>
      <ul>
        <Item name="sword" id="1"/>
        <Item name="bow" id="1"/>
      </ul>
    </div>
  );
}

type SortableItemProps = {
  name: string;
  id: number
}

function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: props.id});

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Item  ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {props.name}
    </Item>
  )
  
}

// https://docs.dndkit.com/presets/sortable#drag-overlay
const Item = forwardRef(({name, ...props}:any, ref) => {
  return (
    <li {...props} ref={ref}>{props.children}</li>
  )
});


