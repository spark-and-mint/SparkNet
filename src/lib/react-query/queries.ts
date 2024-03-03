import { IClient, IMember, INewClient, INewMember } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  assignMemberToClient,
  createClient,
  createMemberAccount,
  deleteClient,
  getClientById,
  getClients,
  getMembers,
  signInAccount,
  signOutAccount,
  updateClient,
} from "../appwrite/api"
import { QUERY_KEYS } from "./queryKeys"

export const useCreateMemberAccount = () => {
  return useMutation({
    mutationFn: (member: INewMember) => createMemberAccount(member),
  })
}

export const useCreateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (client: INewClient) => createClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENTS],
      })
    },
  })
}

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

export const useGetMembers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBERS],
    queryFn: getMembers,
  })
}

export const useGetClients = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLIENTS],
    queryFn: getClients,
  })
}

export const useGetClientById = (clientId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, clientId],
    queryFn: () => getClientById(clientId),
    enabled: !!clientId,
  })
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (client: IClient) => updateClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENTS],
      })
    },
  })
}

export const useAssignMemberToClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      clientId,
      memberArray,
    }: {
      clientId: string
      memberArray: IMember[]
    }) => assignMemberToClient(clientId, memberArray),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEMBERS],
      })
    },
  })
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ clientId, logoId }: { clientId?: string; logoId: string }) =>
      deleteClient(clientId, logoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENTS],
      })
    },
  })
}
