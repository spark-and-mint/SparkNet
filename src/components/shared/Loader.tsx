import { cn } from "@/lib/utils"
import { RotateCw } from "lucide-react"

const Loader = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center justify-center h-48", className)}>
    <div className="flex items-center justify-center gap-1">
      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </div>
  </div>
)

export default Loader
