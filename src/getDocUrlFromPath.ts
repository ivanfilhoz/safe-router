export function getDocUrlFromPath(path: Path) {
	const docUrl = path
		.map(([name, type]) => {
			if (!type || type === 'static') {
				return name
			}

			if (type === 'dynamic') {
				return `{${name}}`
			}

			if (type === 'catchAll') {
				return `{${name}[0]}/{${name}[1]}/...`
			}
		})
		.join('/')

	return `/${docUrl}`
}
