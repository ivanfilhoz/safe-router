import { getDocUrlFromPath } from './getDocUrlFromPath'

describe('getDocUrlFromPath', () => {
	test('should get a static node', () => {
		const result = getDocUrlFromPath([['hello', 'static']])
		expect(result).toEqual('/hello')
	})

	test('should get a dynamic node', () => {
		const result = getDocUrlFromPath([['hello', 'dynamic']])
		expect(result).toEqual('/{hello}')
	})

	test('should get a nested dynamic node', () => {
		const result = getDocUrlFromPath([
			['hello', 'static'],
			['world', 'dynamic'],
		])
		expect(result).toEqual('/hello/{world}')
	})

	test('should get a nested catchAll node', () => {
		const result = getDocUrlFromPath([
			['hello', 'static'],
			['world', 'catchAll'],
		])
		expect(result).toEqual('/hello/{world[0]}/{world[1]}/...')
	})
})
