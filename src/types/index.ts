export type INewMember = {
  email: string
  password: string
  name: string
  file: File[]
  primaryRole: string
}

export type IMember = {
  id: string
  email: string
  name: string
  avatarUrl: string
  primaryRole: string
  clients: IClient[]
  contractSigned: boolean
  applicationStatus: "form completed" | "1on1 done" | "accepted" | "rejected"
}

export type INewClient = {
  name: string
  slug: string
  file: File[]
}

export type IClient = {
  id: string
  name: string
  slug: string
  logoUrl: URL | string
  logoId: string
  file: File[]
  description: string
  members: IMember[]
  resources: string[]
}

export type IResource = {
  name: string
  file: File[]
  link: string
  icon: "design" | "document"
}
