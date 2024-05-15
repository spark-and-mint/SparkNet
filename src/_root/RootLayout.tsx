import { UserNav } from "@/components/shared/UserNav"
import { Link, NavLink, Outlet } from "react-router-dom"

const RootLayout = () => {
  const links = [
    {
      name: "Requests",
      href: "/",
    },
    {
      name: "Applicants",
      href: "/applicants",
    },
    {
      name: "Members",
      href: "/members",
    },
    {
      name: "Stakeholders",
      href: "/stakeholders",
    },
    {
      name: "Clients",
      href: "/clients",
    },
  ]

  return (
    <div className="w-full max-w-screen-xl xl:max-w-[80rem] mx-auto pt-12 pb-24 px-4">
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
            <NavLink
              to={link.href}
              key={link.href}
              className={({ isActive }) =>
                `flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary text-muted-foreground ${
                  isActive && "bg-muted font-medium text-primary"
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <UserNav />
      </div>

      <section>
        <Outlet />
      </section>
    </div>
  )
}

export default RootLayout
