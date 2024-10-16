import { buildSearchParamsMap } from '../service/buildSearchParamsMap'
import { createMockProgram } from '../mocks/program'

// Paths to the files
const routeFileName = 'route.ts'

// Sample TypeScript code to parse (main file)
const routeSourceCode = `
import { CreateSearchParams } from 'safe-router/helpers'

type Props = {
  searchParams: CreateSearchParams<{ tab: string; page?: string[] }>
}

export default function ProductsPage({ searchParams }: Props) {
  // ...
}
`

describe('buildSearchParamsMap', () => {
	test('should generate a search params map', async () => {
		const program = createMockProgram({
			[routeFileName]: routeSourceCode,
		})

		const searchParamsMap = buildSearchParamsMap(program)
		expect(searchParamsMap).toEqual({
			[routeFileName]: {
				tab: {
					type: 'string',
					optional: false,
				},
				page: {
					type: 'array',
					optional: true,
				},
			},
		} satisfies SearchParamsMap)
	})
})
