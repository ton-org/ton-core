// signature_domain.l2#71b34ee1 global_id:int = SignatureDomain;
// signature_domain.empty#e1d571b = SignatureDomain;
export type SignatureDomain = SignatureDomainL2 | SignatureDomainEmpty;

export type SignatureDomainL2 = { type: "l2"; globalId: number };
export type SignatureDomainEmpty = { type: "empty" };

export const signatureDomainL2Tag = 0x71b34ee1;
export const signatureDomainEmptyTag = 0xe1d571b;
