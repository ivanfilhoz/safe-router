import { compileParams } from './compileParams'
import { exampleTree } from './mocks/tree'

describe('compileParams', () => {
	test('should compile a static root tree', () => {
		const tree: Tree = {
			__type: 'static',
		}

		const result = compileParams(tree)
		expect(result).toEqual(
			`{
  '.': {}
}`,
		)
	})

	test('should compile the example tree', () => {
		const result = compileParams(exampleTree)
		expect(result).toEqual(
			`{
  '.': {}
  'about': {}
  'products': {}
  'products.summary': {}
  'products.id': { id: string }
  'products.id.details': { id: string }
  'hello.params': { params: string[] }
  'api': {}
  'api.apiRoute': { apiRoute: string[] }
}`,
		)
	})
})
