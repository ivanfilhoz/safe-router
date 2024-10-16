import { compile } from './compile'
import * as fs from 'node:fs'
import * as path from 'node:path'
import ts from 'typescript'
import { buildSearchParamsMap } from './buildSearchParamsMap'

export function generate(
	info: ts.server.PluginCreateInfo,
	appDir: string,
	routesFilePath: string,
) {
	let program = info.languageService.getProgram()

	try {
		if (!program) {
			program = ts.createProgram({
				rootNames: info.project.getRootFiles(),
				options: info.project.getCompilerOptions(),
			})
		}
	} catch (e) {
		console.error('safe-router: failed to get TypeScript program')
		return
	}

	const routesFile = compile(program, appDir)

	fs.mkdirSync(path.dirname(routesFilePath), { recursive: true })
	fs.writeFileSync(routesFilePath, routesFile, 'utf8')

	console.log(`safe-router: generated routes file at ${routesFilePath}`)
}
