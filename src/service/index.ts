import * as chokidar from 'chokidar'
import * as path from 'node:path'
import type ts from 'typescript'
import { generate } from './generate'
import { throttle } from './throttle'

function init() {
	function create(info: ts.server.PluginCreateInfo) {
		const logger = info.project.projectService.logger
		const appDir = path.resolve(
			info.project.getCurrentDirectory(),
			info.config.appFolder || 'app',
		)
		const rootDir = path.resolve(info.project.getCurrentDirectory())
		const routesFilePath = path.join(
			rootDir,
			info.config.outputFile || 'routes.generated.ts',
		)

		logger.info(`Starting safe-router plugin at ${appDir}`)
		logger.info(`Using routes file at ${routesFilePath}`)

		const throttledGenerate = throttle(() => generate(info, appDir, routesFilePath), 300);

		// Generate the initial routes file
		throttledGenerate()

		// Watch the app directory for changes using chokidar
		let watcher: chokidar.FSWatcher;
		try {
			watcher = chokidar.watch(appDir, {
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
		} catch (err) {
			logger.info(`safe-router: failed to setup chokidar watcher: ${String(err)}`)
		}

		function fileChanged(filePath: string) {
			if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
				throttledGenerate()
			}
		}

		// Cleanup logic on process exit
    const cleanup = () => {
      logger.info('safe-router: shutting down and cleaning up...');
      if (watcher) {
        watcher.close().catch(err => {
          logger.info(`safe-router: error closing watcher: ${err}`);
        });
      }
    };

    process.on('exit', cleanup);
    // Handle other termination signals
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    process.on('uncaughtException', (err) => {
      logger.info(`safe-router: uncaught exception: ${err}`);
      cleanup();
      process.exit(1);
    });

		return info.languageService
	}

	return { create }
}

export = init
