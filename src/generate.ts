import { compile } from './compile'
import * as fs from 'node:fs'
import * as path from 'node:path'
import ts from 'typescript'

const RETRY_DELAY = 1000
const MAX_RETRY_COUNT = 10

export function generate(
	info: ts.server.PluginCreateInfo,
	appDir: string,
	routesFilePath: string,
	retryCount = 0,
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

	const isReady = program.getSourceFiles().some((sourceFile) => {
		const normalizedAppDir = path.normalize(appDir)
		return sourceFile.fileName.startsWith(normalizedAppDir)
	})

	if (!isReady && retryCount < MAX_RETRY_COUNT) {
		setTimeout(
			() => generate(info, appDir, routesFilePath, retryCount + 1),
			RETRY_DELAY,
		)
		return
	}

	const routesFile = compile(program, appDir)

	fs.mkdirSync(path.dirname(routesFilePath), { recursive: true })
	fs.writeFileSync(routesFilePath, routesFile, 'utf8')

	console.log(`safe-router: generated routes file at ${routesFilePath}`)
}
