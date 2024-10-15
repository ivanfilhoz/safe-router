import * as fs from 'node:fs'
import ts from 'typescript'

export const getSearchParamsFromFile = (filePath: string) => {
	const fileContent = fs.readFileSync(filePath).toString('utf-8')

	const sourceFile = ts.createSourceFile(
		filePath,
		fileContent,
		ts.ScriptTarget.Latest,
		true,
	)

	const visit = (node: ts.Node) => {
		if (
			ts.isTypeReferenceNode(node) &&
			ts.isIdentifier(node.typeName) &&
			node.typeName.text === 'SearchParams'
		) {
			const searchParams: NodeSearchParams = {}

			for (const member of node.members) {
				if (
					ts.isPropertySignature(member) &&
					member.type &&
					ts.isIdentifier(member.name)
				) {
					const name = member.name.escapedText.toString()
					const optional = !!member.questionToken

					let type: NodeSearchParams[string]['type']

					if (member.type.kind === ts.SyntaxKind.StringKeyword) {
						type = 'string'
					} else if (
						ts.isArrayTypeNode(member.type) &&
						member.type.elementType.kind === ts.SyntaxKind.StringKeyword
					) {
						type = 'array'
					} else {
						continue
					}

					searchParams[name] = {
						type,
						optional,
					}
				}
			}

			return searchParams
		}

		ts.forEachChild(node, visit)
	}

	visit(sourceFile)

	return null
}
