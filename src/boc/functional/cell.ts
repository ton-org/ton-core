import { Builder } from "../Builder";
import { Address } from "../../address/Address";
import { Cell } from "../Cell";
import { toNano } from "../../utils/convert";

type Buildable = (builder: Builder) => Builder;

export const cell = (...fns: Buildable[]) => {
  const builder = new Builder();

  for (const fn of fns) {
    fn(builder);
  }

  return builder.endCell();
};

export const setAddress = (value: Address) => (builder: Builder) =>
  builder.storeAddress(value);

export const ref = (value: Cell) => (builder: Builder) =>
  builder.storeRef(value);

export const maybe =
  <T extends unknown>(fn: (arg: T) => Buildable, value: T) =>
  (builder: Builder) => {
    if (value) {
      builder.storeBit(1);
      return fn(value)(builder);
    }
    return builder.storeBit(0);
  };

export const addrNone = () => (builder: Builder) => builder.storeUint(0, 2);

export const coins = (value: number | string | bigint) => (builder: Builder) =>
  builder.storeCoins(toNano(value));

export const nanoCoins = (value: number | bigint) => (builder: Builder) =>
  builder.storeCoins(value);

export const buffer = (value: Buffer) => (builder: Builder) =>
  builder.storeBuffer(value);

export const append = (value: Cell) => (builder: Builder) =>
  builder.storeBuilder(value.asBuilder());
