export type INewMember = {
  email: string
  password: string
  firstName: string
  lastName: string
}

export type IMember = {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerification: boolean
  importedAnswers: boolean
  name: string
  timezone: string
  status: string
  avatarUrl: string
  avatarId: string
  contractSigned: boolean
  profile: {
    workStatus: string
    seniority: string
    rate: string
    roles: string[]
    skills: string[]
    domains: string[]
    availability: string
    lookingFor: string
    website: string
    linkedin: string
    github: string
    x: string
    farcaster: string
    dribbble: string
    behance: string
  }
  profileId: string
  projects: IProject[]
}

export type IUpdateMember = {
  memberId: string
  email: string
  firstName: string
  lastName: string
  profileId: string
  emailVerification?: boolean
  importedAnswers?: boolean
  file: File[]
  avatarId: string
  avatarUrl?: URL | string
  timezone?: string | null
  status?: string
  contractSigned?: boolean
  profile?: {
    workStatus?: string
    seniority?: string
    rate?: string
    roles?: string[]
    skills?: string[]
    domains?: string[]
    availability?: string
    lookingFor?: string
    website?: string
    linkedin?: string
    github?: string
    x?: string
    farcaster?: string
    dribbble?: string
    behance?: string
  }
  projects?: IProject[]
}

export type INewClient = {
  name: string
  file: File[]
}

export type IClient = {
  id: string
  name: string
  website?: string
  x?: string
  linkedin?: string
  description?: string
  members?: IMember[]
  resources?: IResource[]
  projects?: IProject[]
  logoUrl: URL | string
  logoId: string
  file: File[]
}

export type IUpdateStakeholder = {
  stakeholderId: string
  email: string
  firstName: string
  lastName: string
  company?: string
  clientId?: string
  file?: File[]
  avatarId?: string
  avatarUrl?: URL | string
  emailVerification?: boolean
}

export type IResource = {
  title: string
  link: string
  type: "design" | "document" | "other"
}

export type IOption = {
  label: string
  value: string
  [key: string]: string | boolean | undefined
}

export type INewProject = {
  clientId: string
  title: string
}

export type IProject = {
  projectId: string
  title: string
  briefLink?: string
  roadmapLink?: string
  sparkRep?: string
  status?: string
  team?: string[]
}

export type INewOpportunity = {
  clientId: string
  projectId: string
  memberId: string
  status: string
  role: string
  startDate?: Date
  background?: string
  description: string
  duration: string
  type: string
  estimatedEarnings?: string
  responsibilities: string
}

export type IOpportunity = {
  opportunityId: string
  status?: string
  role?: string
  startDate?: Date
  background?: string
  description?: string
  duration?: string
  type?: string
  estimatedEarnings?: string
  responsibilities?: string
}

export type INewMilestone = {
  projectId: string
  title: string
}

export type IMilestone = {
  milestoneId: string
  title: string
  status?: "in progress" | "approved"
}

export type INewUpdate = {
  memberId: string
  milestoneId: string
  title: string
  type?: string
  link?: string
  file?: File[]
  description?: string
}

export type IUpdate = {
  updateId: string
  title: string
  link?: string
  type?: string
  milestone?: string
  description?: string
  feedback?: string
}

export type IRequest = {
  requestId: string
  status: string
}
