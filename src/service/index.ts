import * as chokidar from 'chokidar'
import * as path from 'node:path'
import type ts from 'typescript'
import { generate } from './generate'

function init(modules: {
	typescript: typeof import('typescript/lib/tsserverlibrary')
}) {
	const ts = modules.typescript

	function create(info: ts.server.PluginCreateInfo) {
		const appDir = path.resolve(
			info.project.getCurrentDirectory(),
			info.config.appFolder || 'app',
		)
		const rootDir = path.resolve(info.project.getCurrentDirectory())
		const routesFilePath = path.join(
			rootDir,
			info.config.outputFile || 'routes.generated.ts',
		)

		console.log('Starting safe-router plugin at', appDir)
		console.log('Routes file will be generated at', routesFilePath)

		// Generate the initial routes file
		generate(info, appDir, routesFilePath)

		// Watch the app directory for changes using chokidar
		const watcher = chokidar.watch(appDir, {
			persistent: true,
			ignoreInitial: true,
			depth: 99,
		})

		watcher
			.on('add', fileChanged)
			.on('change', fileChanged)
			.on('unlink', fileChanged)
			.on('addDir', fileChanged)
			.on('unlinkDir', fileChanged)

		function fileChanged(filePath: string) {
			if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
				generate(info, appDir, routesFilePath)
			}
		}

		return info.languageService
	}

	return { create }
}

export = init
