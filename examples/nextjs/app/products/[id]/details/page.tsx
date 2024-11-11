import { RouteParams, routes } from '@/routes.generated'
import { useRouter } from 'next/router'
import type { CreateSearchParams } from 'safe-router/helpers'

export type Props = {
  params: RouteParams['products.id.details']
  searchParams: CreateSearchParams<{ tab: string }>
}

export default function ProductDetailsPage({ params, searchParams }: Props) {
  const router = useRouter()

  const currentTab = searchParams.tab ?? 'default'
  const setTab = (tab: string) => {
    router.push(routes.products.id(params.id).details.get({
      tab
    }))
  }

  return (
    <div>
      Details for product {params.id}

      <button onClick={() => setTab('description')}>Description</button>
      <button onClick={() => setTab('specs')}>Specs</button>
      <button onClick={() => setTab('reviews')}>Reviews</button>

      Current tab: {currentTab}
    </div>
  )
}