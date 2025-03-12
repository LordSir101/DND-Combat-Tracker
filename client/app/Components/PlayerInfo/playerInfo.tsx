import { Socket } from "socket.io-client"
import { Input } from "../input"
import { StatBox } from "../statBox"
import { Status } from "@/app/types"
import { useEffect, useState } from "react"

type playerInfo = {
    socket: Socket
    updateData: (property:string, value: string | number | Status[]) => void
}

export function PlayerInfo(props: playerInfo) {
    const [hp, setHp] = useState(getLocalData("hp") ||10)
    const [lvl, setLvl] = useState(1)
    const [init, setInit] = useState(getLocalData("init") || 0)
    const [name, setName] = useState(getLocalData("name") ||'Player')

    function getLocalData(key:string) {
        // let data = localStorage.getItem("playerData")
        // if(data){
        //   let dataObj = JSON.parse(data)
    
        //   // setHp(dataObj.hp)
        //   // setName(dataObj.name)
        //   // setInit(dataObj.init)
        //   // setStatuses([...dataObj.statuses])
        //   // setItems([...dataObj.items])
        //   return dataObj[key]
        // }
    
        return null
        
    }

    function changeName(name:string) {
        setName(name)
        props.updateData('name', name)
    }
    // function changeLvl(lvl:number) {
    //     setName(lvl)
    //     props.updateData('lvl', name)
    // }
    function changeHp(hp:number) {
        setHp(hp)
        props.updateData('hp', hp)
    }
    function changeInit(init:number) {
        setInit(init)
        props.updateData('init', init)
    }

    useEffect(() => {
        props.updateData('name', name)
        props.updateData('hp', hp)
        props.updateData('init', init)
    
    }, [])

    return (
        <div className=" flex items-center justify-evenly ">
            <div className="flex-col items-center ">
            <h1 className="text-center ">{name}</h1>
            <Input onSubmit={changeName} buttonClass="w-2/6" buttonText="Change"></Input>
            </div>
            <div className="flex">
            <StatBox value={lvl} heading="LVL" updateValue={setLvl}/>
            <StatBox value={hp} heading="HP" updateValue={changeHp}/>
            <StatBox value={init} heading="INIT" updateValue={changeInit}/>
            </div>
        </div>
    )

}