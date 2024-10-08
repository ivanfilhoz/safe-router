import { compile } from './compile'
import * as fs from 'node:fs'

export function generate(appDir: string, routesFilePath: string) {
	fs.writeFileSync(routesFilePath, compile(appDir), 'utf8')
}
