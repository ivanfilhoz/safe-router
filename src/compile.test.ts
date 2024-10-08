import mock from 'mock-fs'
import { exampleFs } from './mocks/fs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { compile } from './compile'

describe('compile', () => {
	afterEach(() => {
		// Restore the real file system after each test
		mock.restore()
	})

	test('should match the example tree', async () => {
		mock({
			'/app': exampleFs,
		})

		const generated = compile('/app')

		mock.restore()

		const outputPath = path.join(__dirname, '..', 'generated', 'routes.ts')
		fs.mkdirSync(path.dirname(outputPath), { recursive: true })
		fs.writeFileSync(outputPath, generated, 'utf-8')
		delete require.cache[outputPath]
		const { routes } = require(outputPath)

		expect(routes.get()).toEqual('/')
		expect(routes.about.get()).toEqual('/about')
		expect(routes.products.get()).toEqual('/products')
		expect(routes.products.id('123').get()).toEqual('/products/123')
		expect(routes.products.id('123').details.get()).toEqual(
			'/products/123/details',
		)
		expect(routes.hello.params('hello', 'world').get()).toEqual(
			'/hello/hello/world',
		)
		expect(routes.api.get()).toEqual('/api')
		expect(routes.api.apiRoute('hello', 'world').get()).toEqual(
			'/api/hello/world',
		)
	})
})
