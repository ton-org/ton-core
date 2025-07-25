import { Cell } from '../boc/Cell';
import {loadStorageInfo, StorageInfo, storeStorageInfo} from './StorageInfo';
import {Builder} from "../boc/Builder";


describe('StorageInfo', () => {
    it('should load and store storage info (old)', () => {
        let oldAccountState = Cell.fromHex('b5ee9c720102160100033d000273c003f73ef51ce3b828b26804e172844051c3cd5c7bef0cd82888bf1aa0f17a9d75a22c85924341e5ef000000d26513758a0d81240a9c513b934001020114ff00f4a413f4bcf2c80b03005100000e3b29a9a3173e8eecf79d2386032eef34836a57a516e67b8613a8d7cae97add903720310401400201200405020148060704f8f28308d71820d31fd31fd31f02f823bbf264ed44d0d31fd31fd3fff404d15143baf2a15151baf2a205f901541064f910f2a3f80024a4c8cb1f5240cb1f5230cbff5210f400c9ed54f80f01d30721c0009f6c519320d74a96d307d402fb00e830e021c001e30021c002e30001c0039130e30d03a4c8cb1f12cb1fcbff1213141502e6d001d0d3032171b0925f04e022d749c120925f04e002d31f218210706c7567bd22821064737472bdb0925f05e003fa403020fa4401c8ca07cbffc9d0ed44d0810140d721f404305c810108f40a6fa131b3925f07e005d33fc8258210706c7567ba923830e30d03821064737472ba925f06e30d08090201200a0b007801fa00f40430f8276f2230500aa121bef2e0508210706c7567831eb17080185004cb0526cf1658fa0219f400cb6917cb1f5260cb3f20c98040fb0006008a5004810108f45930ed44d0810140d720c801cf16f400c9ed540172b08e23821064737472831eb17080185005cb055003cf1623fa0213cb6acb1fcb3fc98040fb00925f03e20201200c0d0059bd242b6f6a2684080a06b90fa0218470d4080847a4937d29910ce6903e9ff9837812801b7810148987159f31840201580e0f0011b8c97ed44d0d70b1f8003db29dfb513420405035c87d010c00b23281f2fff274006040423d029be84c6002012010110019adce76a26840206b90eb85ffc00019af1df6a26840106b90eb858fc0006ed207fa00d4d422f90005c8ca0715cbffc9d077748018c8cb05cb0222cf165005fa0214cb6b12ccccc973fb00c84014810108f451f2a7020070810108d718fa00d33fc8542047810108f451f2a782106e6f746570748018c8cb05cb025006cf165004fa0214cb6a12cb1fcb3fc973fb0002006c810108d718fa00d33f305224810108f459f2a782106473747270748018c8cb05cb025005cf165003fa0213cb6acb1f12cb3fc973fb00000af400c9ed54');
        let cs = oldAccountState.beginParse();
        cs.skip(1);
        cs.loadAddress();

        let storageInfo = loadStorageInfo(cs);

        expect(storageInfo).toEqual({
            used: { cells: 22n, bits: 5705n },
            storageExtra: null,
            lastPaid: 1748811232,
            duePayment: null
        });
    });

    it.each([
      ['9c7b98a341201e6492f2bcf144215e1ddbef6774126caa57784fbce25597d4f7', {
          used: { cells: 22n, bits: 5705n },
          storageExtra: null,
          lastPaid: 1748811232,
          duePayment: null,
      }],
      ['7672b3010077582fa477bf2b070183412aa0d1a9b98ba8c437b9d90b37b6a559', {
          used: { cells: 22n, bits: 5705n },
          storageExtra: {
              dictHash: 0n,
          },
          lastPaid: 1748811232,
          duePayment: null,
      }],
    ])('should store and store storage info %s', (hash: string, data: StorageInfo) => {
        const builder = new Builder();
        storeStorageInfo(data)(builder);
        const c = builder.endCell();
        expect(c.hash().toString('hex')).toEqual(hash);
    });

    // Source: https://github.com/ton-blockchain/ton/blob/b3b2bd1c3c645a931a9aa6cbfc915c258c9012cc/crypto/block/block.tlb#L256-L257
    // storage_info$_ used:StorageUsed last_paid:uint32
    // due_payment:(Maybe Grams) = StorageInfo;
    it('should store and store storage info (old)', () => {
        const builder = new Builder();
        // @ts-ignore
        storeStorageInfo({
            used: { cells: 22n, bits: 5705n },
            lastPaid: 1748811232,
            duePayment: null,
        })(builder);
        const c = builder.endCell();
        expect(c.hash().toString('hex')).toEqual('9c7b98a341201e6492f2bcf144215e1ddbef6774126caa57784fbce25597d4f7');
    });
});
