import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Learn Link
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Log In
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            Sign Up Free
          </Button>
        </div>
      </div>
    </header>
  )
}
