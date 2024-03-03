import { Route, Routes } from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm"
import { Home, Clients, Client } from "./_root/pages"
import SignUpForm from "./_auth/forms/SignUpForm"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import ClientLayout from "./_root/ClientLayout"
import { Toaster } from "@/components/ui/toaster"
import ClientForm from "@/components/shared/client/ClientForm"
import ClientResources from "./components/shared/client/ClientResources"
import "./globals.css"

const App = () => (
  <main>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/sign-up" element={<SignUpForm />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/clients" element={<Clients />} />
        <Route element={<ClientLayout />}>
          <Route path="/clients/:id" element={<Client />} />
          <Route path="/clients/:id/settings" element={<ClientForm />} />
          <Route path="/clients/:id/resources" element={<ClientResources />} />
        </Route>
      </Route>
    </Routes>

    <Toaster />
  </main>
)

export default App
