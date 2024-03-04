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

export type IUpdateMember = {
  memberId: string
  name: string
  email: string
  primaryRole: string
  avatarUrl: URL | string
  avatarId: string
  file: File[]
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
