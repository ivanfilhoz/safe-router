import { getBuildRouteParamsFromNodeSearchParams } from './getBuildRouteParamsFromNodeSearchParams'
import { getChildrenFromTree } from './getChildrenFromTree'
import { getDocUrlFromPath } from './getDocUrlFromPath'
import { getNodeFromPath } from './getNodeFromPath'
import { getRealUrlFromPath } from './getRealUrlFromPath'
import { getVariableNameFromPath } from './getVariableNameFromPath'
import { indent } from './indent'

export function compileRoutes(tree: Tree, path: Path = []) {
	let result = ''

	const node = getNodeFromPath(tree, path)

	if (!node.__type || node.__type === 'static') {
		result += '{'
	}

	if (node.__type === 'dynamic') {
		result += `(${getVariableNameFromPath(path)}: string) => ({`
	}

	if (node.__type === 'catchAll') {
		result += `(...${getVariableNameFromPath(path)}: string[]) => ({`
	}

	if (node.__type) {
		const buildRouteParams = getBuildRouteParamsFromNodeSearchParams(
			node.__searchParams ?? {},
		)

		result += `
  /**
   * @returns ${getDocUrlFromPath(path)}
   */
  get: buildRoute${buildRouteParams}(${getRealUrlFromPath(path)}),`
	}

	const children = getChildrenFromTree(node)
	for (const key in children) {
		const childTree = compileRoutes(tree, [
			...path,
			[key, children[key].__type],
		])
		result += indent(`\n${key}: ${childTree},`)
	}

	if (!node.__type || node.__type === 'static') {
		result += '\n}'
	}

	if (node.__type === 'dynamic' || node.__type === 'catchAll') {
		result += '\n})'
	}

	return result
}
