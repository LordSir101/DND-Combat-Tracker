import { useState } from "react";

interface InputProps {
    addItem: (title: string) => void;
}

export function Input({addItem}: InputProps) {
    const [itemName, setItemName] = useState('');

    function handleAddItem(event: any) {
        addItem(itemName)
        setItemName('')
    }

    return (
        <div className="flex justify-center space-x-2 mb-2 rounded-lg  bg-slate-100 w-full py-2">
            <input className="rounded-lg border-2 border-emerald-900 w-1/2" type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}/>
            <button className="border-2 border-emerald-900 bg-green-50 px-2 rounded-lg w-1/8" onClick={handleAddItem}>Add</button>
        </div>
    )
}
