type InvalidType<K extends PropertyKey> = {
	__error__: `Invalid type for search param '${string & K}'. Expected 'string' or 'string[]'.`
}

type EnforceStringProperties<T> = {
	[K in keyof T]: T[K] extends string | string[] | undefined
		? T[K]
		: InvalidType<K>
}

export type CreateSearchParams<T extends EnforceStringProperties<T>> = T
