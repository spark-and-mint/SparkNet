import { Route, Routes } from "react-router-dom"
import SignInForm from "./_auth/forms/SignInForm"
import { Home, Members, Clients, Client } from "./_root/pages"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"
import ClientLayout from "./_root/ClientLayout"
import { Toaster } from "sonner"
import ClientSettings from "@/components/shared/client/ClientSettings"
import ClientOpportunities from "./components/shared/client/ClientOpportunities"
import ProfileSettings from "./_root/pages/ProfileSettings"
import ClientProject from "./components/shared/client/ClientProject"
import ClientDocuments from "./components/shared/client/ClientDocuments"
import "./globals.css"
import Applicants from "./_root/pages/Applicants"
import ClientStakeholders from "./components/shared/client/ClientStakeholders"
import StakeholderTable from "./components/shared/StakeholderTable"
import ClientPayments from "./components/shared/client/ClientPayments"
import FeedbackRequestTable from "./components/shared/FeedbackRequestTable"

const App = () => (
  <main>
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/sign-in" element={<SignInForm />} />
      </Route>

      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/stakeholders" element={<StakeholderTable />} />
        <Route path="/applicants" element={<Applicants />} />
        <Route path="/feedback" element={<FeedbackRequestTable />} />
        <Route path="/members" element={<Members />} />
        <Route path="/clients" element={<Clients />} />
        <Route element={<ClientLayout />}>
          <Route path="/clients/:id" element={<Client />} />
          <Route
            path="/clients/:id/opportunities"
            element={<ClientOpportunities />}
          />
          <Route path="/clients/:id/settings" element={<ClientSettings />} />
          <Route
            path="/clients/:id/stakeholders"
            element={<ClientStakeholders />}
          />
          <Route path="/clients/:id/documents" element={<ClientDocuments />} />
          <Route path="/clients/:id/payments" element={<ClientPayments />} />
          <Route
            path="/clients/:id/project/:projectId"
            element={<ClientProject />}
          />
        </Route>
        <Route path="/profile-settings/:id" element={<ProfileSettings />} />
      </Route>
    </Routes>

    <Toaster position="top-right" expand={true} richColors />
  </main>
)

export default App
