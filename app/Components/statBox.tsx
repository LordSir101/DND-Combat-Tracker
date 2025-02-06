type StatBoxProps = {
  value: number;
  heading: string;
};

export function StatBox(props: StatBoxProps) {
  return (
    <div className="flex flex-col items-center mx-3">
      <h4 className="text-emerald-900 text-4xl font-bold mb-4 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,1)]">
        {props.heading}
      </h4>
      <input className="statBox justify-center" defaultValue={props.value} type="number" name="points" step="1" max="20" min="0" />
    </div>
    
  )
}