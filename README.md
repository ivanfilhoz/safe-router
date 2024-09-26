# safe-router

[![NPM Version][npm-image]][npm-url]
[![Github License][license-image]](LICENSE)
[![NPM Downloads][downloads-image]][npm-url]

⚡️ Automagic type-safe route generation for [Next.js](https://nextjs.org/).

## Features

- ✅ 100% type-safe
- ✅ Runs as a language service plugin
- ✅ Watches for changes in the app directory
- ✅ Supports dynamic and catch-all routes

## Goals

- 🚧 Built-in support for query parameters
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

```json
{
  "compilerOptions": {
    ...
    "plugins": [
      ...
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

```
app/
├── api
│   ├── [[...params]]
│   │   └── route.ts
├── products
│   ├── [id]
│   │   ├── details
│   │   │   └── page.tsx
│   │   └── page.tsx
│   └── page.tsx
├── settings
│   └── page.tsx
└── page.tsx
```


Use the exported `routes` object to access your routes:
```ts
import { routes } from './routes.generated'

routes.get() // /
routes.api.get() // /api
routes.api.params('hello', 'world') // /api/hello/world
routes.products.get() // /products
routes.products.id('123').get() // /products/123
routes.products.id('123').details.get() // /products/123/details
routes.settings.get() // /settings
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/safe-router.svg
[license-image]: https://img.shields.io/github/license/ivanfilhoz/safe-router.svg
[downloads-image]: https://img.shields.io/npm/dm/safe-router.svg
[npm-url]: https://npmjs.org/package/safe-router
