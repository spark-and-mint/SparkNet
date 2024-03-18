import { useNavigate } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"
import { IMember } from "@/types"
import { getCurrentMember } from "@/lib/appwrite/api"

export const INITIAL_MEMBER: IMember = {
  id: "",
  emailVerification: false,
  email: "",
  name: "",
  firstName: "",
  lastName: "",
  website: "",
  linkedin: "",
  primaryRole: "",
  seniority: "",
  workStatus: "",
  rate: "",
  skills: [],
  domains: [],
  timezone: "",
  availability: "",
  status: null,
  meeting: "",
  avatarUrl: "",
  avatarId: "",
  clients: [],
  contractSigned: false,
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
          emailVerification: currentAccount.emailVerification,
          email: currentAccount.email,
          name: currentAccount.name,
          firstName: currentAccount.firstName,
          lastName: currentAccount.lastName,
          website: currentAccount.website,
          linkedin: currentAccount.linkedin,
          primaryRole: currentAccount.primaryRole,
          seniority: currentAccount.seniority,
          workStatus: currentAccount.workStatus,
          rate: currentAccount.rate,
          skills: currentAccount.skills,
          domains: currentAccount.domains,
          timezone: currentAccount.timezone,
          availability: currentAccount.availability,
          status: currentAccount.status,
          meeting: currentAccount.meeting,
          avatarUrl: currentAccount.avatarUrl,
          avatarId: currentAccount.avatarId,
          clients: currentAccount.clients,
          contractSigned: currentAccount.contractSigned,
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
