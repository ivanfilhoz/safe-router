type AnySearchParams = { [key: string]: string | string[] }

export const buildRoute =
	<T extends AnySearchParams>(url: string) =>
	(searchParams?: T & AnySearchParams) => {
		let ret = url

		if (searchParams) {
			const params = Object.entries(searchParams).reduce(
				(acc, [key, value]) => {
					const values = typeof value === 'string' ? [value] : value
					values.forEach((value) => acc.append(key, value))
					return acc
				},
				new URLSearchParams(),
			)

			ret += `?${params.toString()}`
		}
		return ret
	}
