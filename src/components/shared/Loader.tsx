import { RotateCw } from "lucide-react"

const Loader = () => (
  <div className="flex items-end justify-center h-48">
    <div className="flex items-center justify-center gap-1">
      <RotateCw className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </div>
  </div>
)

export default Loader
