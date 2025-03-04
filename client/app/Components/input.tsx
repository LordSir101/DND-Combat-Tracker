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
        <div className=" flex justify-center">
            <input className={ " textInput"} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)}/>
            <button className={"submitButton " } onClick={handleSubmit} disabled={disabled}>
                <p >{buttonText}</p>
            </button>
        </div>
    )
}

//+ (buttonClass ? buttonClass : "w-1/6")
//(inputClass ? inputClass : "w-5/6 mx-2") +