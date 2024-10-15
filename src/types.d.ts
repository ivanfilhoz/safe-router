type NodeType = 'static' | 'dynamic' | 'catchAll'
type NodeSearchParams = {
	[key: string]: {
		type: 'string' | 'array'
		optional: boolean
	}
}

type Tree = {
	__type?: NodeType
	__searchParams?: NodeSearchParams
	[key: string]: key extends '__type'
		? NodeType
		: key extends '__searchParams'
			? NodeSearchParams
			: Tree
}

type Path = Array<[string, NodeType | undefined]>
