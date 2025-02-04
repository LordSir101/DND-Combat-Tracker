import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Square value={10} />
      <Square value={10} />
      <Square value={10} />
      <Square value={10} />
      <Square value={10} />
      <Square value={10} />
    </div>
   
  );
}

type SquareProps = {
  value: number;
};

function Square({value}: SquareProps) {
  return (
    <input className="square" defaultValue={value} type="number" name="points" step="1" max="20" min="0" />
  )
}
// const Square = ({ value }: SquareProps) =>{
//   <div>{value}</div>;
// } 
  // function handleClick() {
  //   setValue("X");
  // }

