import { Address } from "../../address/Address";
import { SendMode } from "../../types/SendMode";
import { toNano } from "../../utils/convert";
import { beginCell } from "../Builder";
import {
  addrNone,
  cell,
  ref,
  setAddress,
  coins,
  maybe,
  nanoCoins,
} from "./cell";
import {
  bounce,
  bounced,
  setComment,
  createdAt,
  createdLt,
  extraCurrency,
  forwardingFee,
  ihr,
  ihrFee,
  internalMessageCode,
  isInitMessage,
  operationCode,
  queryId,
  sendMode,
  seqno,
} from "./message";
import { validUntil } from "./valid-until";
import { DEFAULT_SUBWALLET_ID, setV4R2, subWallet } from "./wallet";

describe("Functional cell", () => {
  it("should build valid cell as like original builder", () => {
    const testAddress = Address.parse(
      "0QAs9VlT6S776tq3unJcP5Ogsj-ELLunLXuOb1EKcOQi4-QO"
    );

    const externalMessageBody = cell(
      subWallet(),
      validUntil(1000),
      seqno(42),
      setV4R2(),
      sendMode(SendMode.PAY_GAS_SEPARATELY, SendMode.IGNORE_ERRORS),
      ref(
        cell(
          internalMessageCode(),
          ihr(false),
          bounce(false),
          bounced(false),
          addrNone(),
          setAddress(testAddress),
          coins("0.12"),
          extraCurrency(),
          ihrFee(0),
          forwardingFee(0),
          createdAt(0),
          createdLt(0),
          isInitMessage(false),
          maybe(
            ref,
            cell(
              operationCode(0x0f8a7ea5),
              queryId(),
              coins(24),
              setAddress(testAddress),
              setAddress(testAddress),
              maybe(ref, cell()),
              nanoCoins(1),
              maybe(ref, cell(setComment("wow")))
            )
          )
        )
      )
    );

    const externalMessageBodyWithBuilder = beginCell()
      .storeUint(DEFAULT_SUBWALLET_ID, 32)
      .storeUint(1000, 32)
      .storeUint(42, 32)
      .storeUint(0, 8)
      .storeUint(3, 8)
      .storeRef(
        beginCell()
          .storeUint(0, 1)
          .storeBit(1)
          .storeBit(0)
          .storeBit(0)
          .storeUint(0, 2)
          .storeAddress(testAddress)
          .storeCoins(toNano("0.12"))
          .storeBit(0)
          .storeCoins(0)
          .storeCoins(0)
          .storeUint(0, 64)
          .storeUint(0, 32)
          .storeBit(0)
          .storeBit(1)
          .storeRef(
            beginCell()
              .storeUint(0x0f8a7ea5, 32)
              .storeUint(0, 64)
              .storeCoins(toNano(24))
              .storeAddress(testAddress)
              .storeAddress(testAddress)
              .storeBit(1)
              .storeRef(beginCell().endCell())
              .storeCoins(1)
              .storeBit(1)
              .storeRef(
                beginCell().storeUint(0, 32).storeStringTail("wow").endCell()
              )
              .endCell()
          )
          .endCell()
      )
      .endCell();

    expect(externalMessageBody.toBoc()).toEqual(
      externalMessageBodyWithBuilder.toBoc()
    );
  });
});
