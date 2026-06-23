import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ClientsPage } from '@/pages/Clients'
import { DashboardPage } from '@/pages/Dashboard'
import { LoginPage } from '@/pages/Login'
import { ProposalEditorPage } from '@/pages/ProposalEditor'
import { ProposalsPage } from '@/pages/Proposals'
import { PublicProposalPage } from '@/pages/PublicProposal'
import { RegisterPage } from '@/pages/Register'
import { PrivateRoute } from '@/routes/PrivateRoute'
import { Navigate, Route, Routes } from 'react-router-dom'

export const AppRouter = () => (
  <Routes>
    <Route path='/v/:token' element={<PublicProposalPage />} />

    <Route element={<AuthLayout />}>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
    </Route>

    <Route element={<PrivateRoute />}>
      <Route element={<DashboardLayout />}>
        <Route path='/' element={<DashboardPage />} />
        <Route path='/clients' element={<ClientsPage />} />
        <Route path='/proposals' element={<ProposalsPage />} />
        <Route path='/proposals/new' element={<ProposalEditorPage />} />
        <Route path='/proposals/:id' element={<ProposalEditorPage />} />
      </Route>
    </Route>

    <Route path='*' element={<Navigate to='/' replace />} />
  </Routes>
)
