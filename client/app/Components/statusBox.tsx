import { useState } from "react";
import { statusVisuals } from "../statusVisuals";

type StatusBoxProps = {
  statusName: string;
  scale?: string
  removeStatus?: (status: string) => void;

};

export function StatusBox(props: StatusBoxProps) {
  //const [value, setValue] = useState(props.value);
  
  // this obj needs to be here for tailwind to see it
//   let statusVisuals = {
//     blinded: {
//         text: "Blinded",
//         textColor: "text-neutral-200",
//         borderColor: "border-slate-800",
//         innerColor: "bg-slate-500"
//     },
//     charmed: {
//         text: "Charmed",
//         textColor: "text-slate-50",
//         borderColor: "border-purple-700",
//         innerColor: "bg-purple-300"
//     },
//     frightened: {
//         text: "Frightened",
//         textColor: "text-slate-50",
//         borderColor: "border-blue-900",
//         innerColor: "bg-blue-300"
//     },
//     grappled: {
//         text: "Grappled",
//         textColor: "text-neutral-200",
//         borderColor: "border-red-600",
//         innerColor: "bg-red-400"
//     },
//     invisible: {
//         text: "Invisible",
//         textColor: "text-white",
//         borderColor: "border-blue-300",
//         innerColor: "bg-sky-100"
//     }
// }

    const key = props.statusName as keyof typeof statusVisuals
    function handleClose(e:any) {
        if(props.removeStatus){
            props.removeStatus(props.statusName)
        }
    }
   
//   const borderColor:string = statusVisuals[key]["borderColor"]
  

  return (
    // add a margin to the status box if scale property isnt applied for spacing
    <div className={`${props.scale ? props.scale : "mx-3"} relative flex flex-col items-center  border-4 rounded-lg px-4 py-2 ${statusVisuals[key]["borderColor"]} ${statusVisuals[key]["innerColor"]}` } >
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
        
      <p className={`${statusVisuals[key]["textColor"]} ${props.scale} font-bold text-[20px] drop-shadow-[0_1.5px_5px_rgba(0,0,0,1)]`}>
        {statusVisuals[key]["text"]}
      </p>
    </div>
    
  )
}