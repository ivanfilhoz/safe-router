import { getRealUrlFromPath } from '../service/getRealUrlFromPath'

describe('getRealUrlFromPath', () => {
	test('should get a static node', () => {
		const result = getRealUrlFromPath([['hello', 'static']])
		expect(result).toEqual("'/hello'")
	})

	test('should get a dynamic node', () => {
		const result = getRealUrlFromPath([['hello', 'dynamic']])
		expect(result).toEqual('`/${hello}`')
	})

	test('should get a nested catchAll node', () => {
		const result = getRealUrlFromPath([
			['foo', 'static'],
			['hello', 'catchAll'],
		])
		expect(result).toEqual("`/foo/${foo_hello.join('/')}`")
	})
})
