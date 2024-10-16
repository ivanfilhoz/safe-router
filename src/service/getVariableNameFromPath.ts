export function getVariableNameFromPath(path: Path) {
	return path.map(([name]) => name).join('_')
}
