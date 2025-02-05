type StatBoxProps = {
  value: number;
};

export function StatBox({value}: StatBoxProps) {
  return (
    <input className="statBox" defaultValue={value} type="number" name="points" step="1" max="20" min="0" />
  )
}