import { sign } from "@ton/crypto";
import { Builder } from "../Builder";
import { Cell } from "../Cell";
import { SendMode } from "../../types/SendMode";
import { coins } from "./cell";

export const internalMessageCode = () => (builder: Builder) =>
  builder.storeUint(0, 1);

export const externalMessageCode = () => (builder: Builder) =>
  builder.storeUint(2, 2);

export const signed =
  (cellToSign: Cell, privateKey: Buffer) => (builder: Builder) => {
    const signature = sign(cellToSign.hash(), privateKey);

    builder.storeBuffer(signature);
    builder.storeBuilder(cellToSign.asBuilder());

    return builder;
  };

export const setComment = (value: string) => (builder: Builder) => {
  builder.storeUint(0, 32);
  builder.storeStringTail(value);
  return builder;
};

export const queryId = (value?: number) => (builder: Builder) =>
  builder.storeUint(value || 0, 64);

export const seqno = (value?: number) => (builder: Builder) =>
  builder.storeUint(value || 0, 32);

export const sendMode =
  (...modes: SendMode[]) =>
  (builder: Builder) =>
    builder.storeUint(
      modes.reduce((acc, mode) => acc + mode, 0),
      8
    );

export const ihr = (enabled: boolean) => (builder: Builder) =>
  builder.storeBit(!enabled);

export const bounce = (enabled: boolean) => (builder: Builder) =>
  builder.storeBit(enabled);

export const bounced = (isBounced: boolean) => (builder: Builder) =>
  builder.storeBit(isBounced);

export const ihrFee = (value?: number | string | bigint) => coins(value || 0);

export const forwardingFee = (value?: number | string | bigint) =>
  coins(value || 0);

export const createdAt = (value: number) => (builder: Builder) =>
  builder.storeUint(value, 32);

export const createdLt = (value: number) => (builder: Builder) =>
  builder.storeUint(value, 64);

export const isInitMessage = (isInit: boolean) => (builder: Builder) =>
  builder.storeBit(isInit);

export const operationCode = (value: number | bigint) => (builder: Builder) =>
  builder.storeUint(value, 32);

export const extraCurrency = () => (builder: Builder) => builder.storeBit(0); // todo
