import type { DirectoryItems } from 'mock-fs/lib/filesystem'

export const exampleFs: DirectoryItems = {
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
				'page.tsx': '',
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
}
