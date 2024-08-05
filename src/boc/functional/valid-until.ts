import { Builder } from "../Builder";

export const ValidUntil = {
  now: () => Math.floor(Date.now() / 1000),
  seconds: (ttl: number) => ValidUntil.now() + ttl,
  default: () => ValidUntil.seconds(1000),
};

export const validUntil = (value?: number) => (builder: Builder) =>
  builder.storeUint(value || ValidUntil.default(), 32);
