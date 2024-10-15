import * as fs from 'node:fs'
import * as path from 'node:path'
import { getSearchParamsFromFile } from './getSearchParamsFromFile'

export function buildTree(dir: string, type: NodeType = 'static'): Tree {
	const entries = fs.readdirSync(dir, { withFileTypes: true })
	const tree = {} as Tree

	for (const entry of entries) {
		if (
			entry.isFile() &&
			(entry.name === 'page.tsx' || entry.name === 'route.ts')
		) {
			tree.__type = type

			const searchParams = getSearchParamsFromFile(path.join(dir, entry.name))
			if (searchParams) {
				tree.__searchParams = searchParams
			}
		}

		if (entry.isDirectory()) {
			const segment = entry.name
			const entryPath = path.join(dir, segment)

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
