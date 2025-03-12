import { useState } from "react";
import { Socket } from "socket.io-client";

type EventEmitterProps = {
  socket: Socket;
  emitMessage: string;
  btnText: string;
//   heading: string;
//   updateValue?: (value: number) => void;
};

export function EventEmitterBtn(props: EventEmitterProps) {
  
  function handleSubmit(event:any) {
    props.socket.emit(props.emitMessage)
  }

  return (
    <div className="flex flex-col items-center mx-3">
      <button onClick={handleSubmit} className="submitButton w-1/3" >{props.btnText}</button>
    </div>
    
  )
}