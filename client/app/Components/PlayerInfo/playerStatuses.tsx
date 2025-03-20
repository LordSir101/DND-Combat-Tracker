import { Socket } from "socket.io-client"
import { Status } from "@/app/types"
import { useEffect, useState } from "react"
import { getLocalData } from "@/app/utils"
import { statusVisuals } from "@/app/statusVisuals"
import { StatusBox } from "../statusBox"
import { v4 as uuidv4 } from 'uuid';

type PlayerStatuses = {
    socket: Socket
    updateData: (property:string, value: string | number | Status[]) => void
}

export function PlayerStatuses(props: PlayerStatuses) {
    const [statuses, setStatuses] = useState<Status[]>(getLocalData("statuses") ||[])
    const [showStatusMenu, setShowStatusMenu] = useState(false)

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

    useEffect(() => {
        props.updateData('statuses', statuses)
    
    }, [statuses])

    return (
        <div className="borderBox mx-4 mt-8  ">
            <div className="flex justify-center">
              <h1>
                Statuses
              </h1>
            </div>
            
            {/* Display currently applied statuses */}
            <div className="flex flex-wrap gap-2">
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
                // ml-6 mr-4 my-2 grid auto-cols-min grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
                <div className='flex flex-wrap gap-2'> 
      
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
        
    )

}