const TaskList = () => {
  const Done = () => (
    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-1.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
      Done
    </span>
  )

  const InProgress = () => (
    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
      In progress
    </span>
  )

  const NotStarted = () => (
    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400">
      Not started
    </span>
  )

  const tasks = [
    {
      taskName: "Understand Existing Product",
      status: <Done />,
      hours: "2.5",
    },

    {
      taskName: "Design Audit & Improvement Plan",
      status: <InProgress />,
      hours: "4",
    },

    {
      taskName: "User Research Plan",
      status: <NotStarted />,
      hours: "6",
    },

    {
      taskName: "Define New Design System",
      status: <NotStarted />,
      hours: "3",
    },

    {
      taskName: "Product Strategy Presentation",
      status: <NotStarted />,
      hours: "4.5",
    },
  ]

  return (
    <div className="-mt-4 divide-y">
      {tasks.map((item, index) => (
        <div key={index} className="py-5">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-sm font-semibold mr-4">{item.taskName}</div>
            {item.status}
          </div>
          <p className="text-sm text-gray-600">Hours: {item.hours}</p>
        </div>
      ))}
    </div>
  )
}

export default TaskList
