import { compileTree } from './compileTree'

describe('compileTree', () => {
	test('should compile a static root tree', () => {
		const tree: Tree = {
			_: 'static',
		}

		const result = compileTree(tree)
		expect(result).toEqual(
			`{
  /**
   * @returns /
   */
  get: () => '/',
}`,
		)
	})

	test('should compile the example tree', () => {
		const tree: Tree = {
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

		const result = compileTree(tree)
		expect(result).toEqual(
			`{
  /**
   * @returns /
   */
  get: () => '/',
  about: {
    /**
     * @returns /about
     */
    get: () => '/about',
  },
  products: {
    /**
     * @returns /products
     */
    get: () => '/products',
    summary: {
      /**
       * @returns /products/summary
       */
      get: () => '/products/summary',
    },
    id: (products_id: string) => ({
      /**
       * @returns /products/{id}
       */
      get: () => \`/products/\${products_id}\`,
      details: {
        /**
         * @returns /products/{id}/details
         */
        get: () => \`/products/\${products_id}/details\`,
      },
    }),
  },
  hello: {
    params: (...hello_params: string[]) => ({
      /**
       * @returns /hello/{params[0]}/{params[1]}/...
       */
      get: () => \`/hello/\${hello_params.join('/')}\`,
    }),
  },
  api: {
    /**
     * @returns /api
     */
    get: () => '/api',
    apiRoute: (...api_apiRoute: string[]) => ({
      /**
       * @returns /api/{apiRoute[0]}/{apiRoute[1]}/...
       */
      get: () => \`/api/\${api_apiRoute.join('/')}\`,
    }),
  },
}`,
		)
	})
})
