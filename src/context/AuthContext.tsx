import { useNavigate } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"

import { IMember } from "@/types"
import { getCurrentMember } from "@/lib/appwrite/api"

export const INITIAL_MEMBER: IMember = {
  id: "",
  name: "",
  email: "",
  avatarUrl: "",
  primaryRole: "",
  clients: [],
  contractSigned: false,
  applicationStatus: "form completed",
}

const INITIAL_STATE = {
  member: INITIAL_MEMBER,
  isLoading: false,
  isAuthenticated: false,
  setMember: () => {},
  setIsAuthenticated: () => {},
  checkAuthMember: async () => false as boolean,
}

type IContextType = {
  member: IMember
  isLoading: boolean
  setMember: React.Dispatch<React.SetStateAction<IMember>>
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  checkAuthMember: () => Promise<boolean>
}

const AuthContext = createContext<IContextType>(INITIAL_STATE)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [member, setMember] = useState<IMember>(INITIAL_MEMBER)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkAuthMember = async () => {
    setIsLoading(true)

    try {
      const currentAccount = await getCurrentMember()

      if (currentAccount) {
        setMember({
          id: currentAccount.$id,
          name: currentAccount.name,
          email: currentAccount.email,
          primaryRole: currentAccount.primaryRole,
          avatarUrl: currentAccount.avatarUrl,
          clients: currentAccount.clients,
          contractSigned: currentAccount.contractSigned,
          applicationStatus: currentAccount.applicationStatus,
        })
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.error(error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const cookieFallback = localStorage.getItem("cookieFallback")
    if (
      cookieFallback === "[]" ||
      cookieFallback === null ||
      cookieFallback === undefined
    ) {
      navigate("/sign-in")
    }

    checkAuthMember()
  }, [])

  const value = {
    member,
    setMember,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthMember,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useMemberContext = () => useContext(AuthContext)
