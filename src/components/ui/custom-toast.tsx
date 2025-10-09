import { CheckCircle2, Rocket, Send, Star, Trophy } from "lucide-react"

interface CustomToastProps {
  title: string
  description: string
  type: "created" | "started" | "submitted" | "reviewed"
  approve?: boolean
}

export function CustomToast({ title, description, type, approve }: CustomToastProps) {
  const configs = {
    created: {
      icon: Rocket,
      bgGradient: "from-blue-400 to-cyan-400",
      iconBg: "bg-blue-500",
      textColor: "text-blue-900",
      emoji: "🎯",
    },
    started: {
      icon: Star,
      bgGradient: "from-orange-400 to-amber-400",
      iconBg: "bg-orange-500",
      textColor: "text-orange-900",
      emoji: "⚡",
    },
    submitted: {
      icon: Send,
      bgGradient: "from-purple-400 to-violet-400",
      iconBg: "bg-purple-500",
      textColor: "text-purple-900",
      emoji: "📤",
    },
    reviewed: {
      icon: approve ? Trophy : CheckCircle2,
      bgGradient: approve ? "from-green-400 to-emerald-400" : "from-yellow-400 to-amber-400",
      iconBg: approve ? "bg-green-500" : "bg-yellow-500",
      textColor: approve ? "text-green-900" : "text-yellow-900",
      emoji: approve ? "🏆" : "💪",
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br ${config.bgGradient} shadow-lg`}>
      <div className={`${config.iconBg} p-2.5 rounded-full shadow-md flex-shrink-0 animate-bounce`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className={`font-bold text-base ${config.textColor} mb-1 flex items-center gap-2`}>
          {title}
          <span className="text-xl">{config.emoji}</span>
        </div>
        <div className={`text-sm ${config.textColor} opacity-90 leading-relaxed`}>{description}</div>
      </div>
    </div>
  )
}
