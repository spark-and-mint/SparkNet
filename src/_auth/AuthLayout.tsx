import { useMemberContext } from "@/context/AuthContext"
import { Navigate, Outlet } from "react-router-dom"

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
              <h1 className="text-2xl font-semibold mb-8 text-center">
                SparkNet{" "}
                <span role="img" aria-label="sparkles">
                  ✨
                </span>
              </h1>
              <Outlet />
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default AuthLayout
