import { Models } from "appwrite"
import { createContext, useContext } from "react"

export const ClientContext = createContext({} as Models.Document)

// eslint-disable-next-line react-refresh/only-export-components
export function useClient() {
  return useContext(ClientContext)
}
