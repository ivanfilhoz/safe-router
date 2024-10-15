import * as fs from 'node:fs'
import * as path from 'node:path'

export function buildTree(dir: string, _type: NodeType = 'static'): Tree {
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	const tree = {} as Tree

	for (const entry of entries) {
		if (
			entry.isFile() &&
			(entry.name === 'page.tsx' || entry.name === 'route.ts')
		) {
			tree._ = _type
		}

		if (entry.isDirectory()) {
			const segment = entry.name
			const entryPath = path.join(dir, segment)

			const groupMatch = segment.match(/^\((.+)\)$/)

			if (groupMatch) {
				Object.assign(tree, buildTree(entryPath, _type))
				continue
			}

			let type: NodeType = 'static'
			let name: string = segment

			const optionalCatchAllMatch = segment.match(/^\[\[\.\.\.(.+)\]\]$/)
			const catchAllMatch = segment.match(/^\[\.\.\.(.+)\]$/)
			const dynamicMatch = segment.match(/^\[(.+)\]$/)

			if (optionalCatchAllMatch) {
				type = 'catchAll'
				name = optionalCatchAllMatch[1]
			} else if (catchAllMatch) {
				type = 'catchAll'
				name = catchAllMatch[1]
			} else if (dynamicMatch) {
				type = 'dynamic'
				name = dynamicMatch[1]
			}

			const children = buildTree(entryPath, type)
			if (Object.keys(children).length > 0) {
				tree[name] = children
			}
		}
	}

	return tree
}
