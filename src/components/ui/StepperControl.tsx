interface StepperControlProps {
  value: number
  onIncrement: () => void
  onDecrement: () => void
}

export function StepperControl({ value, onIncrement, onDecrement }: StepperControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={onDecrement} className="px-2 text-lg text-w-orange">
        -
      </button>
      <span className="w-6 text-center font-display font-bold">{value}</span>
      <button type="button" onClick={onIncrement} className="px-2 text-lg text-w-orange">
        +
      </button>
    </div>
  )
}
