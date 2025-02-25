import { useState } from "react";
import { statusVisuals } from "../statusVisuals";

type StatusBoxProps = {
  statusName: string;
  id: string
  scale?: string
  removeStatus?: (id:string) => void;
  options?: string[]
  selectedOption?: string //for displaying chesen option in party memeber view
  optionChanged?: (id:string, option:string) => void
};

export function StatusBox(props: StatusBoxProps) {
    const key = props.statusName as keyof typeof statusVisuals

    function handleClose(e:any) {
        if(props.removeStatus){
            props.removeStatus(props.id)
        }
    }

    function handleOptionChange(e:any) {
      if(props.optionChanged) {
        props.optionChanged(props.id, e.target.value)
      }
      
    }

  return (
    // add a margin to the status box if scale property isnt applied for spacing
    <div className={`${props.scale ? props.scale : "mx-3 my-2"} relative flex flex-col items-center  border-4 rounded-lg px-4 py-2 ${statusVisuals[key]["borderColor"]} ${statusVisuals[key]["innerColor"]}` } >
        {
            props.removeStatus ?
                <button
                type="button"
                className="close"
                onClick={handleClose}
                >
                <span>&times;</span>
            </button>
            :
            <></>
        }
        
      <p className={`${statusVisuals[key]["textColor"]} ${props.scale} whitespace-pre font-bold text-[18px] drop-shadow-[0_1.5px_5px_rgba(0,0,0,1)]`}>
        {statusVisuals[key]["text"]} {props.selectedOption && !props.options ? `(${props.selectedOption})` : ''}
        
      </p>
      {
        // display dropdown menu if status has options
        props.options ?
        
        props.options.length > 0 ? 
          <select onChange={handleOptionChange} value={props.selectedOption}>
            {props.options.map((option:string, i:number ) => <option key={i}> {option} </option>)}
          </select>
          :
          <></>
        :
        <></>
      }
    </div>
    
  )
}