export type INewMember = {
  email: string
  password: string
  name: string
}

export type INewClient = {
  name: string
}

export type IMember = {
  id: string
  email: string
  name: string
  imageUrl: string
  primaryRole: string
  assignedTo: null | string
  contractSigned: boolean
  applicationStatus: string
}

export type IClient = {
  name: string
  logo: string
  members: IMember[]
  resources: IResource[]
}

export type IResource = {
  name: string
  file: File[]
  link: string
  icon: "design" | "document"
}
