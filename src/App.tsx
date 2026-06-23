import { mockDb } from '@/api/mock-db'
import { AppToaster } from '@/components/ui/toast'
import { useAuth } from '@/hooks/useAuth'
import { AppRouter } from '@/routes/AppRouter'
import { useEffect } from 'react'

function App() {
  const { hydrateUser } = useAuth()

  useEffect(() => {
    mockDb.seed()
    void hydrateUser()
  }, [hydrateUser])

  return (
    <>
      <AppRouter />
      <AppToaster />
    </>
  )
}

export default App
