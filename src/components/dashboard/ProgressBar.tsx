import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  current: number
  total: number
  label?: string
  showNumbers?: boolean
  className?: string
}

export function ProgressBar({ current, total, label, showNumbers = true, className }: ProgressBarProps) {
  const percentage = (current / total) * 100

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex justify-between text-sm">
          <span>{label}</span>
          {showNumbers && (
            <span>
              {current}/{total}
            </span>
          )}
        </div>
      )}
      <Progress value={percentage} className="h-3" />
    </div>
  )
}
