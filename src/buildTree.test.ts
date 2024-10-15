import { buildTree } from './buildTree'
import mock from 'mock-fs'
import { exampleFs } from './mocks/fs'

describe('buildTree', () => {
	afterEach(() => {
		// Restore the real file system after each test
		mock.restore()
	})

	test('should return an empty object for an empty directory', () => {
		mock({
			'/app': {},
		})

		const result = buildTree('/app')
		expect(result).toEqual({})
	})

	test('should ignore folders without pages', () => {
		mock({
			'/app': {
				assets: {
					'img.png': '',
					'styles.css': '',
				},
			},
		})

		const result = buildTree('/app')
		expect(result).toEqual({})
	})

	test('should support group routes', () => {
		mock({
			'/app': {
				'(home)': {
					'page.tsx': '',
				},
				'(staff)': {
					products: {
						'page.tsx': '',
					},
				},
			},
		})

		const result = buildTree('/app')
		expect(result).toEqual({
			_: 'static',
			products: {
				_: 'static',
			},
		})
	})

	test('should match example tree', () => {
		mock({
			'/app': exampleFs,
		})

		const result = buildTree('/app')
		expect(result).toEqual({
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
		})
	})
})
