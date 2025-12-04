# 💎 @ton/core

Core TypeScript library that implements low level primitives for TON blockchain.

## How to install

```bash
yarn add @ton/core
```
```bash
npm install @ton/core
```

⚠️ Beware that having two versions of `@ton/core` concurrently in the same project is not supported. Use the package manager's functionality ([npm](https://docs.npmjs.com/cli/v8/commands/npm-find-dupes), [yarn](https://yarnpkg.com/cli/dedupe)) in CI to avoid this.

## Formatting

We use `biome` as our formatter. It's compatible to `prettier`, just significantly faster.

IDE Setup: [VSCode](https://marketplace.visualstudio.com/items?itemName=biomejs.biome), [Zed](https://biomejs.dev/reference/zed/)

```sh
yarn run format
```

## Testing

### Debugging in tests

By default tests are running using multiple worker threads. It's faster, but 
undesirable during debugging. `SINGLETHREADED` env variable covers this case

```sh
SINGLETHREADED=1 yarn run test
```

### Coverage report

We use test coverage to eliminate blind spots in our tests.

#### How to?

The goal is to run every function at least once.

1. Build a coverage report 

```sh
yarn run coverage
```

2. Coverage report is written to the `/coverage` directory

3. Open `/coverage/index.html` to check the report

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md).

## Acknowledgements

This library has been created and maintained by the [Whales Corp.](https://tonwhales.com/) and [Dan Volkov](https://github.com/dvlkv). The current maintainer is [TON Studio](https://github.com/ton-studio/).

# License

MIT
