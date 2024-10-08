export const exampleTree: Tree = {
	_: 'static',
	about: {
		_: 'static',
	},
	products: {
		_: 'static',
		summary: {
			_: 'static',
		},
		id: {
			_: 'dynamic',
			details: {
				_: 'static',
			},
		},
	},
	hello: {
		params: {
			_: 'catchAll',
		},
	},
	api: {
		_: 'static',
		apiRoute: {
			_: 'catchAll',
		},
	},
}
