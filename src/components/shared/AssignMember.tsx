import { Models } from "appwrite"
import Select, { ActionMeta } from "react-select"
import SelectStyles from "@/styles/SelectStyles"
import { useAssignMemberToClient } from "@/lib/react-query/queries"
import { useEffect } from "react"

interface AssignMemberProps {
  member: Models.Document
  clients: Models.DocumentList<Models.Document> | undefined
  isLoadingClients: boolean
  refetchClients: () => void
}

const AssignMember = ({
  member,
  clients,
  isLoadingClients,
  refetchClients,
}: AssignMemberProps) => {
  const {
    mutate: assignMemberToClient,
    isPending: isLoadingAssignment,
    isSuccess: assignSuccess,
  } = useAssignMemberToClient()

  const handleAssignment = async (
    action: ActionMeta<{ value: string; label: string }>,
    member: Models.Document
  ) => {
    if (action.action === "select-option") {
      if (!action.option) return
      const clientId = action.option.value
      const clientMembers = clients?.documents.find(
        (client) => client.$id === clientId
      )?.members
      const memberArray = clientMembers ? [...clientMembers, member] : [member]
      assignMemberToClient({ clientId, memberArray, addMember: true })
    } else if (action.action === "remove-value") {
      const clientId = action.removedValue.value
      const clientMembers = clients?.documents.find(
        (client) => client.$id === clientId
      )?.members
      const memberArray = clientMembers
        ? clientMembers.filter(
            (clientMember: Models.Document) => clientMember.$id !== member.$id
          )
        : []
      assignMemberToClient({ clientId, memberArray, addMember: false })
    }
  }

  const clientOptions = clients?.documents.map((client: Models.Document) => ({
    value: client.$id,
    label: client.name,
  }))

  const defaultValue = member.clients.map((client: Models.Document) => ({
    value: client.$id,
    label: client.name,
  }))

  const isLoading = isLoadingClients || isLoadingAssignment

  useEffect(() => {
    if (assignSuccess) {
      refetchClients()
    }
  }, [assignSuccess, refetchClients])

  return (
    <Select
      isMulti
      placeholder="Unassigned"
      isClearable={false}
      options={clientOptions}
      isLoading={isLoading}
      isDisabled={isLoading}
      menuPortalTarget={document.body}
      defaultValue={defaultValue}
      styles={SelectStyles}
      onChange={(_, action) => handleAssignment(action, member)}
    />
  )
}

export default AssignMember
