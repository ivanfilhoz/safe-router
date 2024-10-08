import mock from 'mock-fs'
import { exampleFs } from './mocks/fs'
import * as fs from 'node:fs'
import * as path from 'node:path'
import * as ts from 'typescript'
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

		const transpiled = ts.transpileModule(generated, {
			compilerOptions: {
				module: ts.ModuleKind.CommonJS,
				target: ts.ScriptTarget.ES5,
				strict: true,
			},
		})

		const js = transpiled.outputText
		const jsFilePath = path.join(__dirname, '..', 'generated', 'routes.js')

		fs.mkdirSync(path.dirname(jsFilePath), { recursive: true })
		fs.writeFileSync(jsFilePath, js, 'utf8')

		delete require.cache[jsFilePath]
		const { routes } = require(jsFilePath)

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
