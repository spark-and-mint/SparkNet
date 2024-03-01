import { Route, Routes } from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm"
import { Home, Clients, Client } from "./_root/pages"
import SignUpForm from "./_auth/forms/SignUpForm"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import { Toaster } from "@/components/ui/toaster"
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
        <Route path="/clients/:slug" element={<Client />} />
      </Route>
    </Routes>

    <Toaster />
  </main>
)

export default App
