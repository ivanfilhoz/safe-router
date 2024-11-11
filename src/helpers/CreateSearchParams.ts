type EnforceStringProperties<T> = {
	[K in keyof T]: T[K] extends string | string[] | undefined
		? T[K]
		: `Invalid type for search param '${string & K}'. Expected 'string' or 'string[]'.`
}

export type CreateSearchParams<T extends EnforceStringProperties<T>> = T
