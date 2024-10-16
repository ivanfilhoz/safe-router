import type { DirectoryItems } from 'mock-fs/lib/filesystem'

export const exampleFs = {
	'page.tsx': '',
	assets: {
		'img.png': '',
	},
	about: {
		'page.tsx': '',
	},
	products: {
		'page.tsx': '',
		summary: {
			'page.tsx': '',
		},
		'[id]': {
			'page.tsx': '',
			details: {
				'page.tsx': `
import { CreateSearchParams } from 'safe-router/helpers'

type Props = {
  searchParams: CreateSearchParams<{ tab: string, page?: string[] }>
}				
`,
			},
		},
	},
	hello: {
		'[...params]': {
			'page.tsx': '',
		},
	},
	api: {
		'route.ts': '',
		'[[...apiRoute]]': {
			'route.ts': '',
		},
	},
} satisfies DirectoryItems
