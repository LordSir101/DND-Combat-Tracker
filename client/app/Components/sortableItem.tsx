import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { InventoryItem } from '../types';
import { useState } from 'react';

type SortableItemProps = {
    data: InventoryItem
}

export function SortableItem(props: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.data.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const [isClicked, setIsClicked] = useState(false);
    //const [currDescription, setCurrDescription] = useState('');

    function handleClick()
    {
        setIsClicked(!isClicked)
    }

    function handleDescriptionChange(text:string)
    {
        props.data.description = text
    }

    return (
        <li className="my-0" ref={setNodeRef} style={style}>
            <div className="rounded-lg  bg-slate-100 w-full mb-2">
                <div className='flex items-center'>
                    <svg
                        {...listeners}
                        {...attributes}
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2 h-6 w-6 text-gray-400 outline-none"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                    <button className=" rounded-lg  bg-slate-100 w-4/5 mb-2" onClick={handleClick}>
                        
                            <p className="mx-4">{props.data.name}</p>
                    </button>
                    <div className='flex justify-end w-1/6'>
                        <input  className="z-50 pl-1 mx-4 border-2 border-black rounded-lg w-full " defaultValue="1" type="number" step="1" max="9999"/>
                    </div>
                </div>
                {
                    isClicked ?
                    <div className='ml-6 mr-4 my-2'>
                        <input type="text" defaultValue={props.data.description} className="border-black rounded-lg w-full p-2" onChange={(e) => handleDescriptionChange(e.target.value)}/>
                    </div>

                    :

                    <div></div>
                }
           
            </div>
           
            
            
        </li>
    )

}

