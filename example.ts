const router = {
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
		id: (products_id: string) => ({
			/**
			 * @returns /products/{id}
			 */
			get: () => `/products/${products_id}`,
			details: {
				/**
				 * @returns /products/{id}/details
				 */
				get: () => `/products/${products_id}/details`,
			},
		}),
	},
	hello: {
		/**
		 * @returns /hello/{params[0]}/{params[1]}/...
		 */
		params: (...hello_params: string[]) => `/hello/${hello_params.join('/')}`,
	},
	api: {
		/**
		 * @returns /api
		 */
		get: () => '/api',
		/**
		 * @returns /api/{apiRoute[0]}/{apiRoute[1]}/...
		 */
		apiRoute: (...api_apiRoute: string[]) => `/api/${api_apiRoute.join('/')}`,
	},
}

console.log(router.get()) // /
console.log(router.about.get()) // /about
console.log(router.products.get()) // /products
console.log(router.products.id('123').get()) // /products/123
console.log(router.products.id('123').details.get()) // /products/123/details
console.log(router.hello.params('hello', 'world')) // /hello/hello/world
console.log(router.api.get()) // /api
console.log(router.api.apiRoute('hello', 'world')) // /api/hello/world
