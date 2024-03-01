import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { NavLink } from "react-router-dom"

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  links: {
    to: string
    title: string
  }[]
}

export function SidebarNav({ className, links, ...props }: SidebarNavProps) {
  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: "ghost" }),
              `justify-start ${
                isActive
                  ? "bg-muted hover:bg-muted"
                  : "hover:bg-transparent hover:underline"
              }`
            )
          }
          end
        >
          {link.title}
        </NavLink>
      ))}
    </nav>
  )
}
