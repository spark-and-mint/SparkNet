import { Route, Routes } from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm"
import { Home, Members, Clients, Client } from "./_root/pages"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import ClientLayout from "./_root/ClientLayout"
import { Toaster } from "sonner"
import ClientForm from "@/components/shared/client/ClientForm"
import ClientResources from "./components/shared/client/ClientResources"
import ProfileSettings from "./_root/pages/ProfileSettings"
import "./globals.css"

const App = () => (
  <main>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInForm />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/members" element={<Members />} />
        <Route path="/clients" element={<Clients />} />
        <Route element={<ClientLayout />}>
          <Route path="/clients/:id" element={<Client />} />
          <Route path="/clients/:id/settings" element={<ClientForm />} />
          <Route path="/clients/:id/resources" element={<ClientResources />} />
        </Route>
        <Route path="/profile-settings/:id" element={<ProfileSettings />} />
      </Route>
    </Routes>

    <Toaster position="top-right" expand={true} richColors />
  </main>
)

export default App
