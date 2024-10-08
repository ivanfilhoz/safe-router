import { compile } from './compile'
import * as fs from 'node:fs'
import * as path from 'node:path'

export function generate(appDir: string, routesFilePath: string) {
	fs.mkdirSync(path.dirname(routesFilePath), { recursive: true })
	fs.writeFileSync(routesFilePath, compile(appDir), 'utf8')

	console.log(
		'safe-router: generated routes file at ',
		new Date().toISOString(),
	)
}
