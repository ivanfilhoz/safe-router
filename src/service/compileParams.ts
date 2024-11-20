import { getChildrenFromTree } from './getChildrenFromTree'
import { getNodeFromPath } from './getNodeFromPath'
import { getParamsFromPath } from './getParamsFromPath'

export function compileParams(tree: Tree) {
	let result = `{
  '.': never`

	const compileSubTree = (path: Path) => {
		let res = ''

		const node = getNodeFromPath(tree, path)

		if (node.__type) {
			const fullKey = path.map(([name]) => name).join('.')
			const params = getParamsFromPath(path)
			res += `\n  '${fullKey}': ${params}`
		}

		const children = getChildrenFromTree(node)
		for (const key in children) {
			res += compileSubTree([...path, [key, children[key].__type]])
		}
		return res
	}

	const children = getChildrenFromTree(tree)
	for (const key in children) {
		result += compileSubTree([[key, children[key].__type]])
	}

	result += '\n}'

	return result
}
