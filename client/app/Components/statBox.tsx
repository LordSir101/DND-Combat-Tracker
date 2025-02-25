import { useState } from "react";

type StatBoxProps = {
  value: number;
  heading: string;
  updateValue?: (value: number) => void;
};

export function StatBox(props: StatBoxProps) {
  const [value, setValue] = useState(props.value);
  
  function handleChange(event:any) {
    if(props.updateValue) {
      setValue(event.target.value)
      props.updateValue(event.target.value)
    }
  }

  return (
    <div className="flex flex-col items-center mx-3 ">
      <h2 className="text-gray-800  text-lg font-bold">
        {props.heading}
      </h2>
      <input onChange={handleChange} className="subBox statBox justify-center" defaultValue={props.value} type="number" name="points" step="1" max="20" min="0" />
    </div>
    
  )
}