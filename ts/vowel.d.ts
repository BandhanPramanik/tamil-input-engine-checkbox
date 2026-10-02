type VowelGroup = "0" | "1" | "2" | "4" | "5";
type FineFeaturesDec = "0" | "1" | "2";
interface CoarsePosition {
    gamma_2: boolean;
    gamma_1: boolean;
    gamma_0: boolean;
}
interface CoarseValidity {
    v_h: boolean;
}
interface FineFeatures {
    h: boolean;
    m: boolean;
}
export declare function rewriteCoarsePosition(vg: VowelGroup): CoarsePosition;
export declare function rewriteFineFeatures(fd: FineFeaturesDec): FineFeatures;
export declare function findCoarseValidity({ gamma_2 }: CoarsePosition): CoarseValidity;
interface NormalWorld {
    features: FineFeatures;
    validity: CoarseValidity;
    xi: boolean;
}
interface ExtendedWorld {
    e1: boolean;
    e0: boolean;
}
type World = NormalWorld | ExtendedWorld;
export declare function evalV(t: boolean, world: World): number;
export {};
//# sourceMappingURL=vowel.d.ts.map