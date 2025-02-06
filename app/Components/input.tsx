import { useState } from "react";

interface InputProps {
    addItem: (title: string) => void;
  }

export function Input({addItem}: InputProps) {
    const [itemName, setItemName] = useState('');

    function handleAddItem(event: any) {
        console.log(itemName)
        addItem(itemName)
        setItemName('')
    }

    return (
        <div className="flex items-center space-x-2">
            <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)}/>
            <button onClick={handleAddItem}>Add</button>
        </div>
    )
}
