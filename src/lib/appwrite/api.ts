import { ID, Models, Query } from "appwrite"
import { appwriteConfig, account, databases, storage, avatars } from "./config"
import {
  IClient,
  IMember,
  IMilestone,
  INewClient,
  INewMilestone,
  INewOpportunity,
  INewProject,
  IOpportunity,
  IProject,
  IUpdateMember,
} from "@/types"
import { nanoid } from "nanoid"

export async function signInAccount(member: {
  email: string
  password: string
}) {
  try {
    const session = await account.createEmailSession(
      member.email,
      member.password
    )
    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getCurrentMember() {
  try {
    const currentAccount = await getAccount()

    if (!currentAccount) throw Error

    const currentMember = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.memberCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    )

    if (!currentMember) throw Error

    return currentMember.documents[0]
  } catch (error) {
    return null
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get()
    return currentAccount
  } catch (error) {
    return null
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current")
    return session
  } catch (error) {
    console.log(error)
  }
}

export async function getMembers() {
  const members = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.memberCollectionId
  )

  if (!members) throw Error

  return members
}

export async function getProfiles() {
  const profiles = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.profileCollectionId
  )

  if (!profiles) throw Error

  return profiles
}

export async function getMemberById(memberId: string) {
  try {
    const member = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.memberCollectionId,
      memberId
    )

    if (!member) throw Error

    return member
  } catch (error) {
    console.log(error)
  }
}

export async function updateMember(member: IUpdateMember) {
  const hasFileToUpdate = member.file.length > 0
  try {
    let avatar = {
      avatarUrl: member.avatarUrl,
      avatarId: member.avatarId,
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(member.file[0])
      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      avatar = { ...avatar, avatarUrl: fileUrl, avatarId: uploadedFile.$id }
    }

    const updatedMember = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.memberCollectionId,
      member.memberId,
      {
        firstName: member.firstName,
        lastName: member.lastName,
        email: member.email,
        avatarUrl: avatar.avatarUrl,
        avatarId: avatar.avatarId,
      }
    )

    if (!updatedMember) {
      if (hasFileToUpdate) {
        await deleteFile(avatar.avatarId)
      }
      throw Error
    }

    if (member.avatarId && hasFileToUpdate) {
      await deleteFile(member.avatarId)
    }

    return updatedMember
  } catch (error) {
    console.log(error)
  }
}

export async function getClients() {
  const clients = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.clientCollectionId
  )

  if (!clients) throw Error

  return clients
}

export async function createClient(client: INewClient) {
  try {
    let logoUrl
    let uploadedFile

    if (client.file[0]) {
      uploadedFile = await uploadFile(client.file[0])

      if (!uploadedFile) throw Error

      logoUrl = getFilePreview(uploadedFile.$id)
      if (!logoUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }
    } else {
      logoUrl = avatars.getInitials(client.name)
    }

    const newClient = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      ID.unique(),
      {
        name: client.name,
        logoId: uploadedFile ? uploadedFile.$id : nanoid(),
        logoUrl,
      }
    )

    if (!newClient && uploadedFile) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    return newClient
  } catch (error) {
    console.log(error)
  }
}

export async function getClientById(clientId?: string) {
  if (!clientId) throw Error

  try {
    const client = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      clientId
    )

    if (!client) throw Error

    return client
  } catch (error) {
    console.log(error)
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

    return uploadedFile
  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000
    )

    if (!fileUrl) throw Error

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

export async function updateClient(client: IClient) {
  const hasFileToUpdate = client.file.length > 0

  try {
    let logo = {
      logoUrl: client.logoUrl,
      logoId: client.logoId,
    }

    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(client.file[0])
      if (!uploadedFile) throw Error

      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      logo = { ...logo, logoUrl: fileUrl, logoId: uploadedFile.$id }
    }

    const updatedClient = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      client.id,
      {
        name: client.name,
        description: client.description,
        website: client.website,
        x: client.x,
        linkedin: client.linkedin,
        resources: client.resources,
        projects: client.projects,
        logoUrl: logo.logoUrl,
        logoId: logo.logoId,
      }
    )

    if (!updatedClient) {
      if (hasFileToUpdate) {
        await deleteFile(logo.logoId)
      }

      throw Error
    }

    if (hasFileToUpdate) {
      await deleteFile(client.logoId)
    }

    return updatedClient
  } catch (error) {
    console.log(error)
  }
}

export async function assignMemberToClient(
  clientId: string,
  memberArray: IMember[]
) {
  try {
    const updatedClient = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      clientId,
      {
        members: memberArray,
      }
    )

    if (!updatedClient) throw Error

    return updatedClient
  } catch (error) {
    console.log(error)
  }
}

export async function deleteClient(clientId?: string, logoId?: string) {
  if (!clientId || !logoId) return

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      clientId
    )

    if (!statusCode) throw Error

    await deleteFile(logoId)

    return { status: "Ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)
    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}

export async function createProject(project: INewProject) {
  try {
    const newProject = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.projectCollectionId,
      ID.unique(),
      {
        clientId: project.clientId,
        title: project.title,
        status: "in progress",
      }
    )

    return newProject
  } catch (error) {
    console.log(error)
  }
}

export async function updateProject(project: IProject) {
  try {
    const updatedProject = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.projectCollectionId,
      project.projectId,
      {
        title: project.title,
        sparkRep: project.sparkRep,
        briefLink: project.briefLink,
        roadmapLink: project.roadmapLink,
      }
    )

    if (!updatedProject) {
      throw Error
    }

    return updatedProject
  } catch (error) {
    console.log(error)
  }
}

export async function getProjectById(projectId?: string) {
  if (!projectId) throw Error

  try {
    const project = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.projectCollectionId,
      projectId
    )

    if (!project) throw Error

    return project
  } catch (error) {
    console.log(error)
  }
}

export async function getClientProjects(clientId?: string) {
  if (!clientId) return

  try {
    const projects = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.projectCollectionId,
      [Query.equal("clientId", clientId), Query.orderDesc("$createdAt")]
    )

    if (!projects) throw Error

    return projects
  } catch (error) {
    console.log(error)
  }
}

export async function createOpportunity(opportunity: INewOpportunity) {
  try {
    const newOpportunity = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.opportunityCollectionId,
      ID.unique(),
      {
        clientId: opportunity.clientId,
        projectId: opportunity.projectId,
        memberId: opportunity.memberId,
        status: opportunity.status,
        role: opportunity.role,
        background: opportunity.background,
        description: opportunity.description,
        duration: opportunity.duration,
        type: opportunity.type,
        estimatedEarnings: opportunity.estimatedEarnings,
        responsibilities: opportunity.responsibilities,
      }
    )

    return newOpportunity
  } catch (error) {
    console.log(error)
  }
}

export async function updateOpportunity(opportunity: IOpportunity) {
  try {
    const updatedOpportunity = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.opportunityCollectionId,
      opportunity.opportunityId,
      {
        status: opportunity.status,
        role: opportunity.role,
        background: opportunity.background,
        description: opportunity.description,
        duration: opportunity.duration,
        type: opportunity.type,
        estimatedEarnings: opportunity.estimatedEarnings,
        responsibilities: opportunity.responsibilities,
      }
    )

    if (!updatedOpportunity) {
      throw Error
    }

    return updatedOpportunity
  } catch (error) {
    console.log(error)
  }
}

export async function getOpportunityById(opportunityId?: string) {
  if (!opportunityId) throw Error

  try {
    const opportunity = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.opportunityCollectionId,
      opportunityId
    )

    if (!opportunity) throw Error

    return opportunity
  } catch (error) {
    console.log(error)
  }
}

export async function getClientOpportunities(clientId?: string) {
  if (!clientId) return

  try {
    const opportunities = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.opportunityCollectionId,
      [Query.equal("clientId", clientId), Query.orderDesc("$createdAt")]
    )

    if (!opportunities) throw Error

    return opportunities
  } catch (error) {
    console.log(error)
  }
}

export async function deleteOpportunity(
  opportunityId?: string,
  clientId?: string
) {
  if (!opportunityId) return

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.opportunityCollectionId,
      opportunityId
    )

    if (!statusCode) throw Error

    return clientId
  } catch (error) {
    console.log(error)
  }
}

export async function getProjectMilestones(projectId?: string) {
  if (!projectId) return

  try {
    const milestones = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.milestoneCollectionId
    )

    if (!milestones) throw Error

    const projectMilestones = milestones.documents.filter(
      (milestone: Models.Document) => milestone.projectId === projectId
    )

    return projectMilestones
  } catch (error) {
    console.log(error)
  }
}

export async function getMilestoneUpdates(milestoneId?: string) {
  if (!milestoneId) return

  try {
    const updates = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.updateCollectionId
    )

    if (!updates) throw Error

    const milestoneUpdates = updates.documents.filter(
      (update: Models.Document) => update.milestoneId === milestoneId
    )

    return milestoneUpdates
  } catch (error) {
    console.log(error)
  }
}

export async function createMilestone(milestone: INewMilestone) {
  try {
    const newMilestone = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.milestoneCollectionId,
      ID.unique(),
      {
        projectId: milestone.projectId,
        title: milestone.title,
      }
    )

    return newMilestone
  } catch (error) {
    console.log(error)
  }
}

export async function updateMilestone(milestone: IMilestone) {
  try {
    const updatedMilestone = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.milestoneCollectionId,
      milestone.milestoneId,
      {
        title: milestone.title,
        status: milestone.status,
      }
    )

    if (!updatedMilestone) {
      throw Error
    }

    return updatedMilestone
  } catch (error) {
    console.log(error)
  }
}

export async function deleteMilestone(milestoneId?: string) {
  if (!milestoneId) return

  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.milestoneCollectionId,
      milestoneId
    )

    if (!statusCode) throw Error

    return { status: "Ok", milestoneId }
  } catch (error) {
    console.log(error)
  }
}

export async function getProjectTeam(
  projectId?: string,
  memberIds: string[] = []
) {
  if (!projectId || !memberIds.length)
    throw Error("Invalid project ID or member IDs")

  try {
    const opportunities = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.opportunityCollectionId,
      [Query.equal("projectId", projectId)]
    )

    const memberRoles = opportunities.documents.reduce((acc, doc) => {
      if (memberIds.includes(doc.memberId)) {
        acc[doc.memberId] = doc.role
      }
      return acc
    }, {})

    const teamMembers = await Promise.all(
      memberIds.map(async (memberId) => {
        const memberDetails = await databases.getDocument(
          appwriteConfig.databaseId,
          appwriteConfig.memberCollectionId,
          memberId
        )

        return {
          id: memberId,
          firstName: memberDetails.firstName,
          lastName: memberDetails.lastName,
          avatarUrl: memberDetails.avatarUrl,
          role: memberRoles[memberId] || "Team member",
        }
      })
    )

    return teamMembers || []
  } catch (error) {
    console.error("Failed to fetch project team: ", error)
    throw new Error("Error fetching project team")
  }
}
