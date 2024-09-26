export function indent(str: string, indent = 1) {
	return str
		.split('\n')
		.map((line) => (line.trim().length ? '  '.repeat(indent) + line : line))
		.join('\n')
}
