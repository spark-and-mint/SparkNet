import { UserNav } from "@/components/shared/UserNav"
import { Link, Outlet, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const RootLayout = () => {
  const location = useLocation()
  const links = [
    {
      name: "Members",
      href: "/",
    },
    {
      name: "Work opportunities",
      href: "/clients",
    },
  ]

  return (
    <div className="pt-12 px-48 w-full">
      <div className="relative flex items-center justify-between pb-12">
        <div className="flex items-center gap-3">
          <Link to="/">
            <h1 className="text-xl font-semibold">
              SparkNet{" "}
              <span role="img" aria-label="sparkles">
                ✨
              </span>
            </h1>
          </Link>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex gap-2">
          {links.map((link) => (
            <Link
              to={link.href}
              key={link.href}
              className={cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                location.pathname === link.href
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <UserNav />
      </div>

      <section className="flex flex-1 h-full w-full">
        <Outlet />
      </section>
    </div>
  )
}

export default RootLayout
