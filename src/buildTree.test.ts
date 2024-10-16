import mock from 'mock-fs'
import { buildTree } from './buildTree'
import { exampleFs } from './mocks/fs'
import { exampleTree } from './mocks/tree'
import { createMockProgram } from './mocks/program'
import { buildSearchParamsMap } from './buildSearchParamsMap'

describe('buildTree', () => {
	afterEach(() => {
		mock.restore()
	})

	test('should return an empty object for an empty directory', () => {
		mock({
			'/app': {},
		})

		const result = buildTree({}, '/app')
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

		const result = buildTree({}, '/app')
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

		const result = buildTree({}, '/app')
		expect(result).toEqual({
			__type: 'static',
			products: {
				__type: 'static',
			},
		})
	})

	test('should match example tree', () => {
		mock({
			'/app': exampleFs,
		})

		const result = buildTree(
			{
				'/app/products/[id]/details/page.tsx': {
					tab: {
						type: 'string',
						optional: false,
					},
					page: {
						type: 'array',
						optional: true,
					},
				},
			},
			'/app',
		)
		expect(result).toEqual(exampleTree)
	})
})
