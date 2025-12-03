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

## Reference Documentation

[Documentation](https://ton-org.github.io/ton-core/)

## Debugging in tests

By default tests are running using multiple worker threads. It's faster, but 
undesirable during debugging. `SINGLETHREADED` env variable covers this case

```sh
SINGLETHREADED=1 yarn run test
```

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md).

## Acknowledgements

This library has been created and maintained by the [Whales Corp.](https://tonwhales.com/) and [Dan Volkov](https://github.com/dvlkv). The current maintainer is [TON Studio](https://github.com/ton-studio/).

# License

MIT
