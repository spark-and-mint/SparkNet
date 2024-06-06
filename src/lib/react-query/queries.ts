import {
  IClient,
  IDocument,
  IMember,
  IMilestone,
  INewClient,
  INewMilestone,
  INewOpportunity,
  INewProject,
  IOpportunity,
  IProject,
  IRequest,
  IUpdateDocument,
  IUpdateMember,
  IUpdateStakeholder,
} from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  assignMemberToClient,
  createClient,
  createDocument,
  createMilestone,
  createOpportunity,
  createProject,
  deleteClient,
  deleteDocument,
  deleteMilestone,
  deleteOpportunity,
  getClientById,
  getClientDocuments,
  getClientOpportunities,
  getClientProjects,
  getClients,
  getEukapayInvoice,
  getEukapayInvoices,
  getMemberById,
  getMemberStatus,
  getMembers,
  getMilestoneUpdates,
  getOpportunityById,
  getProfileById,
  getProfiles,
  getProjectById,
  getProjectMilestones,
  getProjectTeam,
  getRequestStatus,
  getRequests,
  getStakeholders,
  getUpdateFeedback,
  signInAccount,
  signOutAccount,
  updateClient,
  updateDocument,
  updateMember,
  updateMilestone,
  updateOpportunity,
  updateProject,
  updateRequest,
  updateStakeholder,
} from "../appwrite/api"
import { QUERY_KEYS } from "./queryKeys"

export const useCreateOpportunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (opportunity: INewOpportunity) =>
      createOpportunity(opportunity),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_OPPORTUNITIES, data?.clientId],
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
        queryKey: [QUERY_KEYS.GET_CLIENT_PROJECTS, data?.clientId],
      }),
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, data?.clientId],
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
          queryKey: [QUERY_KEYS.GET_CLIENT_BY_ID, data?.clientId],
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

export const useGetMemberById = (memberId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBER_BY_ID, memberId],
    queryFn: () => getMemberById(memberId),
    enabled: !!memberId,
  })
}

export const useGetMemberStatus = (memberId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBER_STATUS, memberId],
    queryFn: () => getMemberStatus(memberId),
    enabled: false,
  })
}

export const useGetProfileById = (profileId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBER_BY_ID, profileId],
    queryFn: () => getProfileById(profileId),
    enabled: !!profileId,
  })
}

export const useUpdateMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (member: IUpdateMember) => updateMember(member),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEMBERS],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEMBER_STATUS, data?.$id],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_MEMBER],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MEMBER_BY_ID, data?.$id],
      })
    },
  })
}

export const useGetStakeholders = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_STAKEHOLDERS],
    queryFn: getStakeholders,
  })
}

export const useGetRequests = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REQUESTS],
    queryFn: getRequests,
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

export const useCreateMilestone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (milestone: INewMilestone) => createMilestone(milestone),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_MILESTONES],
      })
    },
  })
}

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (milestone: IMilestone) => updateMilestone(milestone),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_MILESTONES],
      })
    },
  })
}

export const useDeleteMilestone = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ milestoneId }: { milestoneId?: string }) =>
      deleteMilestone(milestoneId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_PROJECT_MILESTONES],
      })
    },
  })
}

export const useGetProjectMilestones = (projectId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_MILESTONES, projectId],
    queryFn: () => getProjectMilestones(projectId),
    enabled: !!projectId,
  })
}

export const useGetMilestoneUpdates = (milestoneId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_MILESTONE_UPDATES, milestoneId],
    queryFn: () => getMilestoneUpdates(milestoneId),
    enabled: !!milestoneId,
  })
}

export const useGetProjectTeam = (projectId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PROJECT_TEAM, projectId],
    queryFn: () => getProjectTeam(projectId),
    enabled: !!projectId,
  })
}

export const useUpdateRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: IRequest) => updateRequest(request),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REQUEST_STATUS, data?.$id],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_REQUESTS],
      })
    },
  })
}

export const useGetRequestStatus = (requestId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REQUEST_STATUS, requestId],
    queryFn: () => getRequestStatus(requestId),
    enabled: false,
  })
}

export const useUpdateStakeholder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (stakeholder: IUpdateStakeholder) =>
      updateStakeholder(stakeholder),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_STAKEHOLDERS],
      })
    },
  })
}

export const useGetClientDocuments = (clientId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CLIENT_DOCUMENTS, clientId],
    queryFn: () => getClientDocuments(clientId),
    enabled: !!clientId,
  })
}

export const useCreateDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (document: IDocument) => createDocument(document),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_DOCUMENTS],
      })
    },
  })
}

export const useUpdateDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (document: IUpdateDocument) => updateDocument(document),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_DOCUMENTS],
      })
    },
  })
}

export const useDeleteDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (documentId: string) => deleteDocument(documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CLIENT_DOCUMENTS],
      })
    },
  })
}

export const useGetUpdateFeedback = (updateId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_UPDATE_FEEDBACK, updateId],
    queryFn: () => getUpdateFeedback(updateId),
    enabled: !!updateId,
  })
}

export const useGetEukapayInvoices = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EUKAPAY_INVOICES],
    queryFn: () => getEukapayInvoices(),
  })
}

export const useGetEukapayInvoice = (code: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EUKAPAY_INVOICE],
    queryFn: () => getEukapayInvoice(code),
  })
}
