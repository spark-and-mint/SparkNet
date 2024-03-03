import { ID, Query } from "appwrite"
import { appwriteConfig, account, databases, storage, avatars } from "./config"
import {
  IClient,
  IMember,
  INewClient,
  INewMember,
  IUpdateMember,
} from "@/types"

export async function createMemberAccount(member: INewMember) {
  try {
    const uploadedFile = await uploadFile(member.file[0])

    if (!uploadedFile) throw Error

    const fileUrl = getFilePreview(uploadedFile.$id)
    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      throw Error
    }

    const newAccount = await account.create(
      ID.unique(),
      member.email,
      member.password,
      member.name
    )

    if (!newAccount) throw Error

    const newMember = await saveMemberToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      primaryRole: member.primaryRole,
      avatarUrl: fileUrl,
    })

    return newMember
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function saveMemberToDB(member: {
  accountId: string
  email: string
  name: string
  primaryRole: string
  avatarUrl: URL
}) {
  try {
    const newMember = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.memberCollectionId,
      ID.unique(),
      member
    )

    return newMember
  } catch (error) {
    console.log(error)
  }
}

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
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(member.file[0])
      if (!uploadedFile) throw Error

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      avatar = { ...avatar, avatarUrl: fileUrl, avatarId: uploadedFile.$id }
    }

    //  Update member
    const updatedMember = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.memberCollectionId,
      member.memberId,
      {
        name: member.name,
        email: member.email,
        primaryRole: member.primaryRole,
        avatarUrl: avatar.avatarUrl,
        avatarId: avatar.avatarId,
      }
    )

    // Failed to update
    if (!updatedMember) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(avatar.avatarId)
      }
      // If no new file uploaded, just throw error
      throw Error
    }

    // Safely delete old file after successful update
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
        slug: client.slug,
        logoId: uploadedFile ? uploadedFile.$id : ID.unique(),
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
      2000,
      "top",
      100
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
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(client.file[0])
      if (!uploadedFile) throw Error

      // Get new file url
      const fileUrl = getFilePreview(uploadedFile.$id)
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id)
        throw Error
      }

      logo = { ...logo, logoUrl: fileUrl, logoId: uploadedFile.$id }
    }

    //  Update client
    const updatedClient = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.clientCollectionId,
      client.id,
      {
        avatarUrl: logo.logoUrl,
        logoId: logo.logoId,
      }
    )

    // Failed to update
    if (!updatedClient) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(logo.logoId)
      }

      // If no new file uploaded, just throw error
      throw Error
    }

    // Safely delete old file after successful update
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
