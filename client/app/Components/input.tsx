import { useState } from "react";

interface InputProps {
    onSubmit: (title: string) => void;
    buttonText: string;
    disabled?: boolean;
    inputClass?: string;
    buttonClass?: string;
}

export function Input({onSubmit, buttonText, disabled, inputClass, buttonClass}: InputProps) {
    const [inputValue, setInputValue] = useState('');

    function handleSubmit(event: any) {
        onSubmit(inputValue)
        setInputValue('')
    }

    return (
        <div className="w-full flex">
            <input className={(inputClass ? inputClass : "w-5/6 mx-2") + " textInput"} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button className={"submitButton " + (buttonClass ? buttonClass : "w-1/6")} onClick={handleSubmit} disabled={disabled}>{buttonText}</button>
        </div>
    )
}
