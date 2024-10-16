import { getNodeFromPath } from '../service/getNodeFromPath'

describe('getNodeFromPath', () => {
	test('should get a static node', () => {
		const tree: Tree = {
			_: 'static',
			hello: {
				_: 'static',
			},
		}

		const result = getNodeFromPath(tree, [['hello', 'static']])
		expect(result).toEqual({
			_: 'static',
		})
	})

	test('should get a dynamic node', () => {
		const tree: Tree = {
			_: 'static',
			hello: {
				_: 'dynamic',
			},
		}

		const result = getNodeFromPath(tree, [['hello', 'dynamic']])
		expect(result).toEqual({
			_: 'dynamic',
		})
	})

	test('should get a nested node', () => {
		const tree: Tree = {
			_: 'static',
			hello: {
				_: 'static',
				world: {
					_: 'static',
				},
			},
		}

		const result = getNodeFromPath(tree, [
			['hello', 'static'],
			['world', 'static'],
		])
		expect(result).toEqual({
			_: 'static',
		})
	})
})
