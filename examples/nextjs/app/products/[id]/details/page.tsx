import { routes } from '@/routes.generated'
import type { CreateSearchParams } from 'safe-router/helpers'

export type Props = {
  searchParams: CreateSearchParams<{ tab: string, page?: string[] }>
}

routes.products.id('123').details.get({
  tab: 'hello',
})