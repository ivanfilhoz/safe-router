export const getBuildRouteParamsFromNodeSearchParams = (
	nodeSearchParams: NodeSearchParams,
) => {
	const fragments = Object.entries(nodeSearchParams)
		.reduce((acc, [key, param]) => {
			acc.push(
				`${key}${param.optional ? '?' : ''}: ${param.type === 'array' ? 'string[]' : 'string'}`,
			)
			return acc
		}, [] as string[])
		.join(', ')

	return fragments ? `<{ ${fragments} }>` : ''
}
