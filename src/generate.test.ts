import mock from 'mock-fs'
import { exampleFs } from './mocks/fs'
import { generate } from './generate'
import * as fs from 'node:fs'
import * as path from 'node:path'

const outputFilePath = path.join(__dirname, '..', 'generated', 'routes.ts')

describe('generate', () => {
	afterEach(() => {
		// Restore the real file system after each test
		mock.restore()
	})

	test('should generate a file', () => {
		mock({
			'/app': exampleFs,
		})

		generate('/app', outputFilePath)

		expect(fs.existsSync(outputFilePath)).toBeTruthy()
	})
})
