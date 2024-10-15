export const exampleTree: Tree = {
	__type: 'static',
	about: {
		__type: 'static',
	},
	products: {
		__type: 'static',
		summary: {
			__type: 'static',
		},
		id: {
			__type: 'dynamic',
			details: {
				__type: 'static',
				__searchParams: {
					tab: {
						type: 'string',
						optional: true,
					},
				},
			},
		},
	},
	hello: {
		params: {
			__type: 'catchAll',
		},
	},
	api: {
		__type: 'static',
		apiRoute: {
			__type: 'catchAll',
		},
	},
}
