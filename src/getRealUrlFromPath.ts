import { getVariableNameFromPath } from './getVariableNameFromPath'

export function getRealUrlFromPath(path: Path) {
	let hasParams = false
	const url = path
		.map(([name, type], index) => {
			if (!type || type === 'static') {
				return name
			}

			hasParams = true
			const variableName = getVariableNameFromPath(path.slice(0, index + 1))
			return type === 'catchAll'
				? `\${${variableName}.join('/')}`
				: `\${${variableName}}`
		})
		.join('/')

	return hasParams ? '`/' + url + '`' : `'/${url}'`
}
