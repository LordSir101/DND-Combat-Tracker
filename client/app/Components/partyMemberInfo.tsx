import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { PartyMember } from '../types';
import { useState } from 'react';

type partyMemberInfoProps = {
    data: PartyMember
}

export function PartyMemberInfo(props: partyMemberInfoProps) {
    const {
        // attributes,
        // listeners,
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


    return (
        <li className="my-0" ref={setNodeRef} style={style}>
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
                    <button className=" rounded-lg  bg-slate-100 w-4/5 mb-2" onClick={handleClick}>
                            <p className="mx-4">{props.data.name} HP: {props.data.hp}</p>
                    </button>
                   
                </div>
           
            </div>
           
            
            
        </li>
    )

}

function SetState(arg0: boolean): [any, any] {
    throw new Error('Function not implemented.');
}
