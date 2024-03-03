import { useMemberContext } from "@/context/AuthContext"
import { Link, Navigate, Outlet } from "react-router-dom"

const AuthLayout = () => {
  const { isAuthenticated } = useMemberContext()

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="grid place-items-center h-screen w-full">
            <div className="w-64">
              <Link
                to="/"
                className="block text-2xl font-semibold mb-8 text-center"
              >
                SparkNet{" "}
                <span role="img" aria-label="sparkles">
                  ✨
                </span>
              </Link>
              <Outlet />
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default AuthLayout
