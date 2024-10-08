export const getParamsFromPath = (path: Path) => {
	const dedupedParams = Object.fromEntries(path)

	const params = Object.entries(dedupedParams)
		.map(([name, type]) =>
			type === 'dynamic'
				? `${name}: string`
				: type === 'catchAll'
					? `${name}: string[]`
					: null,
		)
		.filter(Boolean)
		.join(', ')

	return params ? `{ ${params} }` : '{}'
}
