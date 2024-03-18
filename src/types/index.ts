export type INewMember = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type IMember = {
  id: string
  emailVerification: boolean
  email: string
  name: string
  firstName: string
  lastName: string
  website: string
  linkedin: string
  primaryRole: string
  seniority: string
  workStatus: string
  rate: string
  skills: string[]
  domains: string[]
  timezone: string
  availability: string
  status: "form completed" | "1on1 done" | "accepted" | "rejected" | null
  meeting: string
  avatarUrl: string
  avatarId: string
  clients: IClient[]
  contractSigned: boolean
}

export type IUpdateMember = {
  memberId: string
  emailVerification?: boolean
  email?: string | null
  firstName?: string | null
  lastName?: string | null
  website?: string | null
  linkedin?: string | null
  primaryRole?: string | null
  seniority?: string | null
  workStatus?: string | null
  rate?: string | null
  skills?: string[] | null
  domains?: string[] | null
  timezone?: string | null
  availability?: string | null
  status?: "form completed" | "1on1 done" | "accepted" | "rejected" | null
  meeting?: string | null
  avatarUrl?: URL | string
  avatarId: string
  file: File[]
  contractSigned?: boolean
}

export type INewClient = {
  name: string
  file: File[]
}

export type IClient = {
  id: string
  name: string
  logoUrl: URL | string
  logoId: string
  file: File[]
  description?: string
  members?: IMember[]
  resources?: IResource[]
}

export type IResource = {
  title: string
  link: string
  type: "design" | "document" | "other"
}

export type IOption = {
  label: string
  value: string
}
