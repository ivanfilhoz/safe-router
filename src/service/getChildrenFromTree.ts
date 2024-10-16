export const getChildrenFromTree = (node: Tree) => {
	const { __type, __searchParams, ...children } = node
	return children as Record<string, Tree>
}
