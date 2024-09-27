type NodeType = 'static' | 'dynamic' | 'catchAll'

type Tree = {
	[name: string]: key extends '_' ? NodeType : Tree
}

type Path = Array<[string, NodeType]>
