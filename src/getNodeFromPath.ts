export function getNodeFromPath(tree: Tree, path: Path) {
	return path.reduce((acc, [name]) => acc?.[name] as Tree, tree)
}
