import * as path from 'node:path'
import type ts from 'typescript'
import { generate } from './generate'
import { throttle } from './throttle'
import * as fs from 'node:fs'

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

		if (!fs.existsSync(appDir)) {
			logger.info(`safe-router: appDir does not exist: ${appDir}`);
			return info.languageService;
		}
		
		if (!fs.existsSync(rootDir)) {
			logger.info(`safe-router: rootDir does not exist: ${rootDir}`);
			return info.languageService;
		}

		logger.info(`safe-router: watching directory: ${appDir}`);
    logger.info(`safe-router: routes file will be generated at ${routesFilePath}`);

		const throttledGenerate = throttle(() => {
			try {
				generate(info, appDir, routesFilePath)
			} catch (err) {
				logger.info(`safe-router: failed to generate routes file: ${err}`);
			}
		}, 300);

		// Generate the initial routes file on startup
		throttledGenerate();

		// Use TypeScript's built-in directory watcher
    const directoryWatcher = info.serverHost.watchDirectory(
      appDir,
      (filePath) => {
        logger.info(`safe-router: detected change in ${filePath}`);
				throttledGenerate();
      },
      true,
    );

    const cleanup = () => {
      logger.info('safe-router: shutting down and cleaning up...');
      directoryWatcher.close();
    };

    process.on('exit', cleanup);
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
