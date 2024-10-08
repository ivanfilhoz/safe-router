import { getNodeFromPath } from './getNodeFromPath'
import { getParamsFromPath } from './getParamsFromPath'
import { indent } from './indent'

export function compileParams(tree: Tree) {
	let result = `{
  '.': {}`

	const compileSubTree = (path: Path) => {
		let res = ''

		const fullKey = path.map(([name]) => name).join('.')
		const params = getParamsFromPath(path)
		res += `\n  '${fullKey}': ${params}`

		const node = getNodeFromPath(tree, path)
		const { _, ...children } = node
		for (const key in children) {
			const nodeType = (children[key] as Tree)?._ as NodeType
			res += compileSubTree([...path, [key, nodeType]])
		}
		return res
	}

	const { _, ...children } = tree
	for (const key in children) {
		const nodeType = (children[key] as Tree)?._ as NodeType
		result += compileSubTree([[key, nodeType]])
	}

	result += '\n}'

	return result
}
