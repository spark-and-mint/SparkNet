import { useGetMembers } from "@/lib/react-query/queries"
import { Models } from "appwrite"

const MemberList = () => {
  const { data: members, isPending, error } = useGetMembers()
  if (error) console.log("Error fetching members", error)

  return (
    <div>
      {isPending && !members ? (
        "Loading members..."
      ) : (
        <>
          {members?.documents.map((member: Models.Document) => (
            <div key={member.$id}>{member.name}</div>
          ))}
        </>
      )}
    </div>
  )
}

export default MemberList
