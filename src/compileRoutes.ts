import { getDocUrlFromPath } from './getDocUrlFromPath'
import { getNodeFromPath } from './getNodeFromPath'
import { getRealUrlFromPath } from './getRealUrlFromPath'
import { getVariableNameFromPath } from './getVariableNameFromPath'
import { indent } from './indent'

export function compileRoutes(tree: Tree, path: Path = []) {
	let result = ''

	const node = getNodeFromPath(tree, path)

	if (!node._ || node._ === 'static') {
		result += '{'
	}

	if (node._ === 'dynamic') {
		result += `(${getVariableNameFromPath(path)}: string) => ({`
	}

	if (node._ === 'catchAll') {
		result += `(...${getVariableNameFromPath(path)}: string[]) => ({`
	}

	if (node._) {
		result += `
  /**
   * @returns ${getDocUrlFromPath(path)}
   */
  get: () => ${getRealUrlFromPath(path)},`
	}

	const { _, ...children } = node
	for (const key in children) {
		const nodeType = (children[key] as Tree)?._ as NodeType
		const childTree = compileRoutes(tree, [...path, [key, nodeType]])
		result += indent(`\n${key}: ${childTree},`)
	}

	if (!node._ || node._ === 'static') {
		result += '\n}'
	}

	if (node._ === 'dynamic' || node._ === 'catchAll') {
		result += '\n})'
	}

	return result
}
