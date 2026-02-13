export function BudgetRow({
  label,
  value,
  isNegative = false,
}: {
  label: string;
  value: string | number;
  isNegative?: boolean;
}) {
  return (
    <div className="flex justify-between text-muted-foreground">
      <span>{label}</span>
      <span className={`tabular-nums`}> {isNegative ? `- ${value}` : value}</span>
    </div>
  );
}
