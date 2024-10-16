import ts from 'typescript'

export const buildSearchParamsMap = (program: ts.Program) => {
	const checker = program.getTypeChecker()
	const map: SearchParamsMap = {}

	program.getSourceFiles().forEach((sourceFile) => {
		let isHelperImported = false
		const searchParams: NodeSearchParams = {}

		const visit = (node: ts.Node) => {
			// Search for the CreateSearchParams type from 'safe-router/helpers' import
			if (
				ts.isImportDeclaration(node) &&
				node.moduleSpecifier.kind === ts.SyntaxKind.StringLiteral &&
				node.moduleSpecifier.getText().slice(1, -1) === 'safe-router/helpers' &&
				node.importClause?.namedBindings?.kind === ts.SyntaxKind.NamedImports &&
				node.importClause?.namedBindings.elements.some(
					(element) =>
						element.name.escapedText.toString() === 'CreateSearchParams',
				)
			) {
				isHelperImported = true
			}

			// Search for instances of the CreateSearchParams types and add them to the map
			if (
				isHelperImported &&
				ts.isTypeReferenceNode(node) &&
				ts.isIdentifier(node.typeName) &&
				node.typeName.text === 'CreateSearchParams'
			) {
				// Use the checker to get the type of the CreateSearchParams type, excluding types that are not string or string[]
				const type = checker.getTypeFromTypeNode(node)
				const properties = type.getProperties()

				for (const property of properties) {
					const declarations = property.getDeclarations()
					if (!declarations || declarations.length === 0) continue

					const isStringType = (type: ts.Type) =>
						(type.flags & ts.TypeFlags.String) !== 0
					const isStringArrayType = (type: ts.Type) => {
						const indexType = checker.getIndexTypeOfType(
							type,
							ts.IndexKind.Number,
						)
						return !!(indexType && !!(indexType.flags & ts.TypeFlags.String))
					}

					const propType = checker.getTypeAtLocation(declarations[0])
					const isOptional =
						(property.getFlags() & ts.SymbolFlags.Optional) !== 0
					const isString = propType.isUnion()
						? propType.types.some(isStringType)
						: isStringType(propType)
					const isStringArray = propType.isUnion()
						? propType.types.some(isStringArrayType)
						: isStringArrayType(propType)

					// check for string
					if (isString) {
						searchParams[property.name] = {
							type: 'string',
							optional: isOptional,
						}
						// check for string[]
					} else if (isStringArray) {
						searchParams[property.name] = {
							type: 'array',
							optional: isOptional,
						}
					}
				}

				map[sourceFile.fileName] = searchParams
			}

			ts.forEachChild(node, visit)
		}

		visit(sourceFile)
	})

	return map
}
