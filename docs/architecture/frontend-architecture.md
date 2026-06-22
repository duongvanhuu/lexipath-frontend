# LexiPath Frontend Architecture

LexiPath uses a single Next.js source structure.

## Versions

- Node.js: 24 LTS
- npm: >=10
- Next.js: 16.2.9
- React: 19.2.7
- React DOM: 19.2.7
- TypeScript: ^5.9.0

## Structure

- `src/app`: Next.js App Router.
- `src/components`: shared and domain components.
- `src/features`: business feature modules.
- `src/lib`: API, utils, auth, validators, formatters.
- `src/providers`: app providers.
- `src/styles`: global CSS and tokens.
- `src/constants`: shared constants.
- `src/types`: shared TypeScript types.
