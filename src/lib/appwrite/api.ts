import { ID, Query } from "appwrite"
import { appwriteConfig, account, databases, storage } from "./config"
import { INewMember } from "@/types"

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
    console.log("saving member to db")
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

export async function getClients() {
  const clients = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.clientCollectionId
  )

  if (!clients) throw Error

  return clients
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

// ============================== GET FILE URL
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

// ============================== DELETE FILE
export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: "ok" }
  } catch (error) {
    console.log(error)
  }
}
