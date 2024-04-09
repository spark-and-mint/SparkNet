import {
  IClient,
  IMember,
  INewClient,
  INewOpportunity,
  INewProject,
  IOpportunity,
  IProject,
  IUpdateMember,
} from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  assignMemberToClient,
  createClient,
  createOpportunity,
  createProject,
  deleteClient,
  deleteOpportunity,
  getClientById,
  getClientOpportunities,
  getClientProjects,
  getClients,
  getMemberById,
  getMembers,
  getOpportunityById,
  getProfiles,
  getProjectById,
  signInAccount,
  signOutAccount,
  updateClient,
  updateMember,
  updateOpportunity,
  updateProject,
} from "../appwrite/api"
import { QUERY_KEYS } from "./queryKeys"

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (opportunity: INewOpportunity) =>
      createOpportunity(opportunity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_OPPORTUNITIES, data?.client.$id],
      })
    },
  })
}

export const useUpdateOpportunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (opportunity: IOpportunity) => updateOpportunity(opportunity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_OPPORTUNITY_BY_ID, data?.$id],
      })
    },
  })
}

export const useGetOpportunityById = (opportunityId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_OPPORTUNITY_BY_ID, opportunityId],
    queryFn: () => getOpportunityById(opportunityId),
    enabled: !!opportunityId,
  })
}

export const useGetClientOpportunities = (clientId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLIENT_OPPORTUNITIES, clientId],
    queryFn: () => getClientOpportunities(clientId),
    enabled: !!clientId,
  })
}

export const useDeleteOpportunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      opportunityId,
      clientId,
    }: {
      opportunityId?: string
      clientId?: string
    }) => deleteOpportunity(opportunityId, clientId),
    onSuccess: (clientId) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_OPPORTUNITIES, clientId],
      })
    },
  })
}

export const useCreateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (project: INewProject) => createProject(project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_PROJECTS, data?.client.$id],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, data?.client.$id],
        })
    },
  })
}

export const useUpdateProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (project: IProject) => updateProject(project),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, data?.$id],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, data?.client.$id],
        })
    },
  })
}

export const useGetProjectById = (projectId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_BY_ID, projectId],
    queryFn: () => getProjectById(projectId),
    enabled: !!projectId,
  })
}

export const useGetClientProjects = (clientId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLIENT_PROJECTS, clientId],
    queryFn: () => getClientProjects(clientId),
    enabled: !!clientId,
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
    mutationFn: (member: { email: string; password: string }) =>
      signInAccount(member),
  })
}

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: signOutAccount,
  })
}

export const useGetMemberById = (memberId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBER_BY_ID, memberId],
    queryFn: () => getMemberById(memberId),
    enabled: !!memberId,
  })
}

export const useUpdateMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (member: IUpdateMember) => updateMember(member),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_MEMBER],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEMBER_BY_ID, data?.$id],
      })
    },
  })
}

export const useGetMembers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBERS],
    queryFn: getMembers,
  })
}

export const useGetProfiles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROFILES],
    queryFn: getProfiles,
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENTS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, data?.$id],
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
      addMember: boolean
    }) => assignMemberToClient(clientId, memberArray),
    onSettled: () => {
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
