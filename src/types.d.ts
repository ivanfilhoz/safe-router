type NodeType = 'static' | 'dynamic' | 'catchAll'

type Tree = {
	[name: string]: Tree | NodeType
}

type Path = Array<[string, NodeType]>
