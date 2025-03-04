import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { InventoryItem } from '../types';
import { useState } from 'react';

type SortableItemProps = {
    data: InventoryItem;
    tradeItem?: (data:InventoryItem) => void
    updateData?: (id:string, quantity: number) => void
    removeItem?: (id: string) => void
}

export function TradeableItem(props: SortableItemProps) {
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
        if(props.tradeItem) {
            props.tradeItem(props.data)
        }
        
    }

    function handleRemove(e: any) {
        if(props.removeItem) {
            props.removeItem(props.data.id)
        }
    }

    // function handleDescriptionChange(text:string)
    // {
    //     props.data.description = text
    //     props.updateData(props.data.id, props.data.description, props.data.quantity)
    // }

    function handleQuantityChange(e:any) {
        props.data.amountToTrade= Number(e.target.value)

        if(props.updateData) {
            props.updateData(props.data.id, props.data.amountToTrade)
        }   
    }

    return (
        
            <div className="rounded-lg  bg-slate-100 w-full mb-2">
                <div className='flex items-center'>
                    {/* <svg
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
                    </svg> */}
                     {
                            !props.tradeItem ?
                                <button className='ml-2 bg-transparent border-none' onClick={handleRemove}>
                                    <span className='text-gray-400 text-2xl'>&times;</span>
                                </button>
                            :
                            <></>
                     }
                    
                    <button className=" rounded-lg  bg-slate-100 w-4/5 mb-2" onClick={handleClick}>
                        
                            <p className="mx-4 text-lg">{props.data.name}</p>
                    </button>
                    <div className='flex justify-center items-start w-1/3'>
                        {
                            !props.tradeItem ?
                            <div>
                                <input  className="z-50 pl-1 mx-2 border-2 border-black rounded-lg w-1/2" defaultValue="1" type="number" step="1" min="0" max={props.data.quantity} onChange={handleQuantityChange}/>
                                <span className='whitespace-pre'> / </span>
                            </div>
                            
                            :
                            <></>
                        }
                        
                        <span>{props.data.quantity}</span>
                    </div>
                </div>
                {/* {
                    isClicked ?
                    <div className='ml-6 mr-4 my-2'>
                        <input type="text" defaultValue={props.data.description} className="border-black rounded-lg w-full p-2" onChange={(e) => handleDescriptionChange(e.target.value)}/>
                    </div>

                    :

                    <div></div>
                } */}
           
            </div>
           
    )

}

