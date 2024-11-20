export const getParamsFromPath = (path: Path) => {
	const dedupedParams = Object.fromEntries(path)

	const params = Object.entries(dedupedParams)
		.map(([name, type]) => {
			switch (type) {
				case 'dynamic': {
					return `${name}: string`
				}
				case 'catchAll': {
					return `${name}: string[]`
				}
				default: {
					return null
				}
			}
		})
		.filter(Boolean)
		.join(', ')

	return params ? `{ ${params} }` : 'never'
}
