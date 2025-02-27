import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { PartyMember } from '../types';
import { useState } from 'react';
import { StatusBox } from './statusBox';
import { statusVisuals } from '../statusVisuals';

type partyMemberInfoProps = {
    data: PartyMember
    handleTrade: (id:string) => void
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

    function handleTrade(e:any) {
        props.handleTrade(props.data.id)
    }

    return (
        <li className="my-0" ref={setNodeRef} style={style}>
            <div className="rounded-lg  bg-slate-100 w-full mb-2">
                <div className='flex items-center w-full'>
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
                    <div className=" rounded-lg  bg-slate-100 mb-2 flex items-start w-full" onClick={handleClick}>
                        <div className='flex items-start mx-4'>
                            <p className="mx-4 my-4 font-bold">{props.data.name} </p>
                            <p className="mx-4  my-4 font-bold whitespace-pre">HP:  {props.data.hp}</p>
                        </div>
                        <button className='submitButton' onClick={handleTrade}>
                            Trade
                        </button>
                       
                        <div className='grid grid-cols-5 w-full'>
                            {
                                props.data.statuses.map((status, i) => {
                                    return <StatusBox key={i} id={status.id} scale="scale-75" statusName={status.status} selectedOption={status.option} />
                                })
                            }
                        </div>
                            
                    </div>
                   
                </div>
           
            </div>
           
            
            
        </li>
    )

}
