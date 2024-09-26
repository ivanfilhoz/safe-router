import { buildTree } from './buildTree'
import mock from 'mock-fs'

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

	test('should match example tree', () => {
		mock({
			'/app': {
				'page.tsx': '',
				assets: {
					'img.png': '',
				},
				about: {
					'page.tsx': '',
				},
				products: {
					'page.tsx': '',
					summary: {
						'page.tsx': '',
					},
					'[id]': {
						'page.tsx': '',
						details: {
							'page.tsx': '',
						},
					},
				},
				hello: {
					'[...params]': {
						'page.tsx': '',
					},
				},
				api: {
					'route.ts': '',
					'[[...apiRoute]]': {
						'route.ts': '',
					},
				},
			},
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
