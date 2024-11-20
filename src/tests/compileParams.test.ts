import { compileParams } from '../service/compileParams'
import { exampleTree } from '../mocks/tree'

describe('compileParams', () => {
	test('should compile a static root tree', () => {
		const tree: Tree = {
			__type: 'static',
		}

		const result = compileParams(tree)
		expect(result).toEqual(
			`{
  '.': never
}`,
		)
	})

	test('should compile the example tree', () => {
		const result = compileParams(exampleTree)
		expect(result).toEqual(
			`{
  '.': never
  'about': never
  'products': never
  'products.summary': never
  'products.id': { id: string }
  'products.id.details': { id: string }
  'hello.params': { params: string[] }
  'api': never
  'api.apiRoute': { apiRoute: string[] }
}`,
		)
	})
})
