import TaskList from "../TaskList"

const ClientProgress = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Vitalik's progress</h3>
      </div>
      <TaskList />
    </div>
  )
}

export default ClientProgress
