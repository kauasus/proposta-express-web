import type { PlanDto } from '@/api/dtos/plan.dto'
import { planService } from '@/api/services/plan.service'
import { EmptyState } from '@/components/shared/EmptyState'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { PageHeader } from '@/components/shared/PageHeader'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Inbox, Layers3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const PlansPage = () => {
  const [plans, setPlans] = useState<PlanDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const data = await planService.list()
        setPlans(data)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'Não conseguimos carregar os planos. Tente novamente.',
        )
      } finally {
        setIsLoading(false)
      }
    }

    void load()
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Planos"
        description="Confira os planos disponíveis para sua conta."
      />

      {isLoading ? (
        <LoadingSkeleton rows={3} />
      ) : plans.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nenhum plano encontrado"
          description="Não há planos disponíveis para sua conta. Contate o suporte se precisar."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.planId}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Layers3 className="h-5 w-5 text-primary" />
                  {plan.name}
                </CardTitle>
                
              </CardHeader>
              <CardContent />
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
