import { useNavigate } from "react-router-dom"
import { createContext, useContext, useEffect, useState } from "react"
import { IMember } from "@/types"
import { getCurrentMember } from "@/lib/appwrite/api"

export const INITIAL_MEMBER: IMember = {
  id: "",
  importedAnswers: false,
  emailVerification: false,
  email: "",
  name: "",
  firstName: "",
  lastName: "",
  timezone: "",
  status: null,
  avatarUrl: "",
  avatarId: "",
  contractSigned: false,
  projects: [],
  profileId: "",
  profile: {
    workStatus: "",
    seniority: "",
    roles: [],
    skills: [],
    domains: [],
    lookingFor: "",
    availability: "",
    rate: "",
    website: "",
    linkedin: "",
    github: "",
    x: "",
    farcaster: "",
    dribbble: "",
    behance: "",
  },
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
      const member = await getCurrentMember()

      if (member) {
        setMember({
          id: member.$id,
          importedAnswers: member.importedAnswers,
          emailVerification: member.emailVerification,
          email: member.email,
          name: member.name,
          firstName: member.firstName,
          lastName: member.lastName,
          status: member.status,
          avatarUrl: member.avatarUrl,
          avatarId: member.avatarId,
          contractSigned: member.contractSigned,
          projects: member.projects,
          timezone: member.timezone,
          profileId: member.profileId,
          profile: {
            workStatus: member.profile?.workStatus,
            seniority: member.profile?.seniority,
            roles: member.profile?.roles,
            skills: member.profile?.skills,
            domains: member.profile?.domains,
            lookingFor: member.profile?.lookingFor,
            availability: member.profile?.availability,
            rate: member.profile?.rate,
            website: member.profile?.website,
            linkedin: member.profile?.linkedin,
            github: member.profile?.github,
            x: member.profile?.x,
            farcaster: member.profile?.farcaster,
            dribbble: member.profile?.dribbble,
            behance: member.profile?.behance,
          },
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
