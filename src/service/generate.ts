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
	const logger = info.project.projectService.logger
	let program = info.languageService.getProgram()
	logger.info('safe-router: getting TypeScript program')

	try {
		if (!program) {
			program = ts.createProgram({
				rootNames: info.project.getRootFiles(),
				options: info.project.getCompilerOptions(),
			})
		}
	} catch (e) {
		logger.info('safe-router: failed to get TypeScript program')
		return
	}

	const isReady = program.getSourceFiles().some((sourceFile) => {
		const normalizedAppDir = path.normalize(appDir)
		return sourceFile.fileName.startsWith(normalizedAppDir)
	})

	if (!isReady && retryCount < MAX_RETRY_COUNT) {
		logger.info( `safe-router: not ready yet, retrying in ${RETRY_DELAY}ms (${retryCount + 1}/${MAX_RETRY_COUNT})`)
		setTimeout(
			() => generate(info, appDir, routesFilePath, retryCount + 1),
			RETRY_DELAY,
		)
		return
	}

	logger.info('safe-router: compiling routes file')
	const routesFile = compile(program, appDir)

	fs.mkdirSync(path.dirname(routesFilePath), { recursive: true })
	fs.writeFileSync(routesFilePath, routesFile, 'utf8')

	logger.info(`safe-router: generated routes file at ${routesFilePath}`)
}
