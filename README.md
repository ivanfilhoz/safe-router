# safe-router

[![NPM Version][npm-image]][npm-url]
[![Github License][license-image]](LICENSE)
[![NPM Downloads][downloads-image]][npm-url]
[![Codecov][codecov-image]][codecov-url]

⚡️ Automagic type-safe route generation for [Next.js](https://nextjs.org/).

## Features

- ✅ 100% type-safe
- ✅ Easy setup, no migration needed
- ✅ Runs as a language service plugin
- ✅ Watches for changes in the app directory
- ✅ Supports dynamic and catch-all routes
- ✅ Supports search parameters (experimental)

## Goals

- 🚧 Support for pages router
- 🚧 Support for other frameworks like Remix

## Requirements

- [Next.js](https://nextjs.org/) >=12
- [TypeScript](https://www.typescriptlang.org/) >=5.0

## Setup

Install the package from the [npm registry](https://www.npmjs.com/package/safe-router):

```bash
npm install safe-router
```

Now, add the following to your `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    // ...
    "plugins": [
      // ...
      {
        "name": "safe-router",
        "appFolder": "app" // (optional)
        "outputFile": "routes.generated.ts" // (optional)
      }
    ]
  }
}
```

## Usage

Given the following directory structure:

```plaintext
app/
├── api/
│   ├── [[...params]]/
│   │   └── route.ts
├── products/
│   ├── [id]/
│   │   ├── details/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── page.tsx
├── settings/
│   └── page.tsx
└── page.tsx
```

Use the exported `routes` object to access your routes throughout your app:

```ts
import { routes } from './routes.generated'

routes.get() // /
routes.api.get() // /api
routes.api.params('hello', 'world').get() // /api/hello/world
routes.products.get() // /products
routes.products.id('123').get() // /products/123
routes.products.id('123').details.get() // /products/123/details
routes.settings.get() // /settings
```

In your page files, use the exported `RouteParams` type to get typed route parameters:

```tsx
import type { RouteParams } from './routes.generated'

type Props = {
  params: RouteParams['product.id.details']
}

export default function ProductDetailsPage({ params }: Props) {
  return <div>Details for product {params.id}</div>
}
```

## Search parameters

Search parameters are supported by using the `CreateSearchParams` type from the `safe-router/helpers` package:

```tsx
import { RouteParams } from '@/routes.generated'
import type { CreateSearchParams } from 'safe-router/helpers'

export type Props = {
  params: RouteParams['products.id.details']
  searchParams: CreateSearchParams<{ tab: string }>
}

export default function ProductDetailsPage({ params, searchParams }: Props) {
  const currentTab = searchParams.tab ?? 'default'

  return (
    <div>
      Details for product {params.id}

      Current tab: {currentTab}
    </div>
  )
}
```

The typed search params will be available as arguments to the `get` method of the route:

```ts
routes.products.id('123').details.get({
  tab: 'specs',
  otherParam: 'hello', // additional params are still supported
}) // /products/123/details?tab=specs&otherParam=hello
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/safe-router.svg
[license-image]: https://img.shields.io/github/license/ivanfilhoz/safe-router.svg
[downloads-image]: https://img.shields.io/npm/dm/safe-router.svg
[npm-url]: https://npmjs.org/package/safe-router
[codecov-image]: https://codecov.io/gh/ivanfilhoz/safe-router/branch/main/graph/badge.svg?token=A1ANWBUXNO
[codecov-url]: https://codecov.io/gh/ivanfilhoz/safe-router