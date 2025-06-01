# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
BREAKING: you should update library to support new `StorageInfo` format. Both versions work fine on mainnet until new format is not enabled.

## Added
- support of a new format of `StorageInfo`, `StorageUsed`
- `StorageExtraInfo` structure

## Fixed
- `StorageInto.ts` renamed to `StorageInfo.ts`
- Anchor regex in `Address.isFriendly` (thx @kolpav)
- `writeInt` with number and size 0 or 1 (thx @stels-cs)
- support rewrite prefixes in anycast addresses (thx @ilyar)

## Removed
- `StorageUsedShort` is replaced by `StorageUsed`


## [0.60.1] - 2025-02-20

## Fixed
- BREAKING: fail if there is remaining data in dictionary value after parsing (security issue)

Notes: if you want to parse dictionary value without checking for remaining data, you can implement your custom `DictionaryValue`

## [0.60.0] - 2025-01-31

## Added
- Extracurrencies support (thx @Trinketer22)

## [0.59.1] - 2024-12-20

## Fixed
- `BitBuilder.writeVarInt` bytes size calculation (thx @Gusarich)

## [0.59.0] - 2024-10-09

## Fixed 
- `TupleReader`: always pop current element in `readStringOpt` and `readBufferOpt` (thx @anton-trunov)

## Added
- `ContractProvider`: `get` now accept numbers as method IDs (thx @anton-trunov)
- `Cell.fromHex` method (thx @krigga)

## [0.58.1] - 2024-09-13

## Fixed
- Contract proxy method discovery

## [0.58.0] - 2024-09-13

## Added
- Methods, prefixed with "is" in the contract classes are now wrapped like "send"/"get"  

## [0.57.0] - 2024-08-16
## Added
- More flexible merkle proof generation (thx @akifoq)
- reserve_currecy, change_library actions for OutList (thx @1IxI1)

## Fixed 
- Number type safety check in BitReader (thx @Trinketer22)


## [0.56.3] - 2024-03-25

## Fixed
- Updated `typescript` to `5.4.3` and fixed compilation errors

## [0.56.2] - 2024-03-19

## Fixed
- `getRepr` and `getRefsDescriptor` now using level mask instead of level
- Cells with prunned branches hash and serialization fixes

## [0.56.1] - 2024-02-27

## Fixed
- Fixed BoC serialization with indicies
- Improve BoC serialization perfomance (thanks @krigga)

Notes: BoC topological sort now is more like C++ impl, however there are still some differences. Tests in your project may fail after this update if you rely on serialized BoC.

## [0.56.0] - 2024-02-23

## Added
- `ContractProvider.getTransactions` method
- `ContractProvider.open` method

## Removed
- `ReopenableContractProvider`, `isReopenableContractProvider` due to inconvenience

## [0.55.0] - 2024-02-12

## Added
- `ReopenableContractProvider` interface to allow reusing same provider for another contract
- `isReopenableContractProvider` type guard to check if contract provider supports new API

## [0.54.0] - 2024-01-29

## Added
- Added `exotic` flag to `Cell.endCell` args (thanks @Gusarich)

## Fixed
- Exotic cells in `storeMessageRelaxed`
- Extracurrency edgecase for `storeMessage` (thanks @aSpite)
- `AccountStatusChange` status parsing (thanks @TrueCarry)
- type definitions for `StateInit` (thanks @Gusarich)

## [0.53.0] - 2023-10-24

## Added

- `Dictionary` `BitString` keys and values (thanks @Trinketer22)
- `BitString.isBitString` method (thanks @Trinketer22)
- `paddedBufferToBits` helper (thanks @Trinketer22)
- `Dictionary.generateMerkeProof` and `Dictionary.generateMerkleUpdate` (thanks @Gusarich)
- `OutAction` and `OutList` (de)serializers (thanks @siandreev)

## Fixed
- `BitString.substring` now accepts `offset` == `str.length`

## [0.52.2] - 2023-09-14

## Fixed
- `Address.isRaw` invalid address regexp

## [0.52.1] - 2023-09-10

## Fixed
- ton-crypto replaced with @ton/crypto in build

## [0.52.0] - 2023-08-24

## Added
- `Transaction.raw` field contains raw transaction cell
- `Transaction.hash` function computes hash of raw transaction cell

## [0.51.0] - 2023-08-17

## Added
- `TupleReader.readLispList`/`TupleReader.readLispListDirect`

## Changed
- `toNano` now accepts fractional numbers

## [0.50.0] - 2023-07-26

## Fixed
- `Address.parse`/`Address.parseRaw`/`Address.parseFriendly` now checks validity of address before parsing
- `loadStringTail` crashed if the slice was partially read

## [0.49.2] - 2023-07-14

## Changed
- Migrated to @ton/crypto package instead of ton-crypto

## [0.49.1] - 2023-05-10

## Fixed
- `Cell.fromBoc` exotic cell parsing
- `Cell.hash` calculation if there is merkle proof in the cell tree
- `BitString.substring` correct shortcut for empty substring

## [0.49.0] - 2023-03-24

## Added
- `Slice.clone(true)` to clone slice and reset it to the begining
- `Slice.offsetBits` and `Slice.offsetRefs` to get current offset in bits and refs
- `BitReader.offset` to get current offset in reader

## [0.48.0] - 2023-02-28

## Added 
- `Library` exotic cell parsing 

## [0.47.1] - 2023-02-06

## Fixed
- Refs Overflow in `storeMessage` and `storeMessageRelaxed`

## [0.47.0] - 2023-02-02

## Added
- `address` helper function for easier address parsing
- `ContractGetMethodResult` and added optional `gasUsed` and `logs` to it

## [0.46.0] - 2023-01-23
## Added
- export the `OpenedContract` type

## [0.45.0] - 2023-01-13

## Added
- `skip` to `TupleReader`

## [0.44.0] - 2023-01-07

## Added
- Ability to pass `Cell` to dict load functions

## [0.43.0] - 2023-01-07

## Changed
- Allow provide key/value serializers only during storing in cell allowing to create an empty dicts
- Limited dictionary key types by `number`, `bigint`, `Address` and `Buffer`

## [0.42.0] - 2023-01-07

## Changed
- `map` -> `dict` in ABI

## [0.41.0] - 2023-01-06

## Added
- `writeAddress` to `TupleBuilder`

## [0.40.0] - 2023-01-06

## Changede
- Rename `Tuple*` to `TupleItem` to avoid name clashing

## Added
- Add `TupleBuilder` helper to build tuples

## [0.39.0] - 2023-01-06

## Added
- `readBuffer`, `readBufferOpt`, `readString`, `readStringOpt` to `TupleReader`
- `storeMaybeBuffer` to `Builder`
- `loadBoolean`, `loadMaybeBoolean`, `loadMaybeUint`, `loadMaybeUintBig`, `loadMaybeInt`, `loadMaybeIntBig` to `Slice`

## [0.38.0] - 2023-01-05

## Added
-  `ABITypeRef`, `ABIField`, `ABIArgument`, `ABIGetter`, `ABIType`, `ABIReceiverMessage`, `ABIReceiver` for ABI interface

## [0.37.0] - 2023-01-04

## Added
- `peek` method in `TupleReader`

## [0.36.1] - 2023-01-03

## Fixed
- `parseTuple` with slices with refs

## [0.36.0] - 2023-01-02

## Added
- `ContractABI`, `ABIError` and optional field `abi` in `Contract` type

## [0.35.0] - 2023-01-02

## Fixed
- `init` field serialization in `MessageRelaxed`
- possible broken `refs` when using `Builder` multiple times

## [0.34.0] - 2023-01-02

## Fixed
- Make `errorCode` non optional in `ComputeError`

## [0.33.0] - 2023-01-02

## Added
- `ComputeError` for throwing when executing contract

## Fixed
- removed `prando` peer dependency

## [0.32.0] - 2022-12-31

## Changes
- Rename `AccountState` to `ContractState` to avoid name clashing with blockchain primitives 

## [0.31.0] - 2022-12-31

## Added
- `openContract` - universal method for libraries to use to open a contract
- `getMethodId` - helper method to get method id from a method name

## [0.30.0] - 2022-12-31

## Changed
- Disallow parsing of exotics by default

## Fixed
- `ShardAccount` parsing
- `Account` parsing

## [0.29.0] - 2022-12-31 

## Fixed
- Missing exports of `StateInit`

## [0.28.0] - 2022-12-31

🔧 Big refactoring, removing obsolete `Message` type and adding new types for working with contracts and accounts.

## Added
- Add parsing of transactions, accounts and blocks

## Removed
- Remove old `Message` type and all relevant types

## [0.27.0] - 2022-12-29

## Fixed
- Fix optionals type in `internal`/`external` helpers

## [0.26.0] - 2022-12-29

## Fixed
- Fix `body` type in `internal` helper

## [0.25.0] - 2022-12-29

## Changeed
- Improved `SenderArguments` types

## [0.24.0] - 2022-12-29

## Changed
- `Sender` arguments optionals

## [0.23.0] - 2022-12-29

## Changed
- Renamed `send` to `internal` and `external` in `ContractProvider`

## [0.22.0] - 2022-12-29
## Added
- `SenderArguments`
- `bounce` flag to `SenderArguments`

## [0.21.0] - 2022-12-29

## Changed
- Ability to pass strings as value or body in `internal` helper

## [0.20.0] - 2022-12-29

## Changed
- Change `amount` to `value` to match schema

## [0.19.0] - 2022-12-29

## Changed
- Change helpers signatures

## [0.18.0] - 2022-12-29

## Added
- Add `Sender` type for sending internal messages
- Add `internal`, `external` and `comment` helpers

## [0.17.0] - 2022-12-28

## Changed
- Change account state from `Cell` to `Buffer`

## [0.16.0] - 2022-12-28

## Added
- Added `Contract`, `ContractProvider` and `AccountState` types

## [0.15.0] - 2022-12-28

## Added
- Added `SendMode`
- Added `safeSign` and `safeSignVerify`

## [0.14.2] - 2022-12-28

## Fixed
- Fixed mutation of a `Cell` when reading from a `Slice` clone

## [0.14.1] - 2022-12-28

## Fixed
- improved return types in `loadDict` and `loadDictDirect`

## [0.14.0] - 2022-12-28

## Added
- `Dictionary`, `DictionaryKey` and `DictionaryValue` to work with TVM dicts
- `loadDict` and `loadDictDirect` to `Slice`
- `storeDict` and `storeDictDirect` to `Builder`

## [0.13.0] - 2022-12-28

## Fixed
- Critical issue in calculating `StateInit` and `contractAddress`

## [0.12.0] - 2022-12-28

## Added
- `toNano` and `fromNano` helper methods
- `crc16` and `crc32c` checksum functions that compatible with TON
- `base32Decode` and `base32Encode` for base32 encoding/decoding
- Messages: `StateInit`, `InternalMessage`, `ExternalMessage`, `EmptyMessage`, `CommentMessage`, `CommonMessageInfo`, `CellMessage`, `BufferMessage`
- `contractAddress` function for calculation of an address
- `storeStringTail`, `storeMaybeStringTail`, `storeStringRefTail`, `storeMaybeStringRefTail` in `Builder`
- `loadStringTail`, `loadMaybeStringTail`, `loadStringRefTail`, `loadMaybeStringRefTail` in `Slice`

## Fixed
- `availableBits` in `Builder`

## [0.11.0] - 2022-12-27

## Added
- `Tuple` object with serialization

## [0.10.1] - 2022-12-27

## Fix
- Hotfix for config contract proofs

## [0.10.0] - 2022-12-27
## Fix
- Fix reading of external addresses in `BitReader`

## [0.9.0] - 2022-12-27

## Changed
- `loadMaybeCell`/`loadCell` -> `loadMaybeRef`/`loadRef` in `Slice`

## [0.8.0] - 2022-12-27
## Added
- `asSlice` to `Builder` and `Cell`
- `asCell` to `Builder` and `Slice`
- `asBuilder` to `Cell` and `Slice`

## [0.7.0] - 2022-12-27

## Added
- `clone` function to `Slice`

## [0.6.0] - 2022-12-27

## Changed
- `loadCoins` and `preloadCoins` returns `bigint` instead of `number`

## [0.5.0] - 2022-12-27

## Added
- `availableBits` and `availableRefs` in `Builder`

## [0.4.0] - 2022-12-27

## Added
- `length` in `BitBuilder`
- `bits` and `refs` in `Builder`
- `storeBuilder` and `storeMaybeBuilder` in `Builder`

## [0.3.0] - 2022-12-27

## Added
- `remaining` in `BitReader`
- `remainingBits`, `remainingRefs`, `loadBuffer` and `preloadBuffer` in `Slice`
- `Writable` type that provides an abstraction of something that could be written to `Builder`
- `storeSlice`, `storeMaybeSlice`, `storeWritable`, `storeMaybeWritable` in `Builder`
## [0.2.0] - 2022-12-27

## Added
- `fromBoc` and `toBoc` to `Cell` for parsing and serializing cells to a BOC.

## [0.1.0] - 2022-12-27
## Added
- `Cell`, `Builder`, `Slice` primitives
- `BitString`, `BitReader`, `BitBuilder` functions
- `exoticMerkleProof`, `exoticMerkleUpdate`, `exoticPruned` functions to parse exotic cells

## [0.0.2]

## Added

- `Address` type that represents TON Standard Address
