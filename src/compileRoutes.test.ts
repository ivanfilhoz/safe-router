import { compileRoutes } from './compileRoutes'
import { exampleTree } from './mocks/tree'

describe('compileRoutes', () => {
	test('should compile a static root tree', () => {
		const tree: Tree = {
			__type: 'static',
		}

		const result = compileRoutes(tree)
		expect(result).toEqual(
			`{
  /**
   * @returns /
   */
  get: buildRoute('/'),
}`,
		)
	})

	test('should compile the example tree', () => {
		const result = compileRoutes(exampleTree)
		expect(result).toEqual(
			`{
  /**
   * @returns /
   */
  get: buildRoute('/'),
  about: {
    /**
     * @returns /about
     */
    get: buildRoute('/about'),
  },
  products: {
    /**
     * @returns /products
     */
    get: buildRoute('/products'),
    summary: {
      /**
       * @returns /products/summary
       */
      get: buildRoute('/products/summary'),
    },
    id: (products_id: string) => ({
      /**
       * @returns /products/{id}
       */
      get: buildRoute(\`/products/\${products_id}\`),
      details: {
        /**
         * @returns /products/{id}/details
         */
        get: buildRoute<{ tab: string }>(\`/products/\${products_id}/details\`),
      },
    }),
  },
  hello: {
    params: (...hello_params: string[]) => ({
      /**
       * @returns /hello/{params[0]}/{params[1]}/...
       */
      get: buildRoute(\`/hello/\${hello_params.join('/')}\`),
    }),
  },
  api: {
    /**
     * @returns /api
     */
    get: buildRoute('/api'),
    apiRoute: (...api_apiRoute: string[]) => ({
      /**
       * @returns /api/{apiRoute[0]}/{apiRoute[1]}/...
       */
      get: buildRoute(\`/api/\${api_apiRoute.join('/')}\`),
    }),
  },
}`,
		)
	})
})
