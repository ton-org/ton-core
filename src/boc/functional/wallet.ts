import { Builder } from "../Builder";

export const DEFAULT_SUBWALLET_ID = 698983191;

export const subWallet = (value?: number) => (builder: Builder) =>
  builder.storeUint(value || DEFAULT_SUBWALLET_ID, 32);

export const setV4R2 = () => (builder: Builder) => builder.storeUint(0, 8);
