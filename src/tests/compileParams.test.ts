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
  '.': object
}`,
		)
	})

	test('should compile the example tree', () => {
		const result = compileParams(exampleTree)
		expect(result).toEqual(
			`{
  '.': object
  'about': object
  'products': object
  'products.summary': object
  'products.id': { id: string }
  'products.id.details': { id: string }
  'hello.params': { params: string[] }
  'api': object
  'api.apiRoute': { apiRoute: string[] }
}`,
		)
	})
})
