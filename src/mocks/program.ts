import ts from 'typescript'
import * as path from 'node:path'
import * as fs from 'node:fs'

const libraryFileName = 'helper.d.ts'
const librarySourceCode = fs.readFileSync(
	path.join(__dirname, '..', 'helpers', 'CreateSearchParams.ts'),
	'utf-8',
)

export const createMockProgram = (_sourceFiles: {
	[fileName: string]: string
}) => {
	const sourceFiles: { [fileName: string]: string } = {
		..._sourceFiles,
		[libraryFileName]: librarySourceCode,
	}

	const compilerOptions: ts.CompilerOptions = {
		module: ts.ModuleKind.CommonJS,
		target: ts.ScriptTarget.ESNext,
		moduleResolution: ts.ModuleResolutionKind.NodeJs,
		skipLibCheck: true,
		paths: {
			'safe-router/helpers': [libraryFileName],
		},
	}

	const compilerHost = ts.createCompilerHost(compilerOptions)

	const originalReadFile = compilerHost.readFile.bind(compilerHost)
	const originalFileExists = compilerHost.fileExists.bind(compilerHost)

	compilerHost.readFile = (fileName) => {
		const baseName = path.basename(fileName)
		return sourceFiles[baseName] ?? originalReadFile(fileName)
	}

	compilerHost.fileExists = (fileName) => {
		const baseName = path.basename(fileName)
		return sourceFiles[baseName] ? true : originalFileExists(fileName)
	}

	const rootNames = Object.keys(sourceFiles)

	return ts.createProgram({
		rootNames,
		options: compilerOptions,
		host: compilerHost,
	})
}
