type VowelGroup = "0" | "1" | "2" | "4" | "5";
type FineFeaturesDec = "0" | "1" | "2";
interface VowelGroupPosition {
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
export declare function rewriteVowelGroupPosition(vg: VowelGroup): VowelGroupPosition;
export declare function rewriteFineFeatures(fd: FineFeaturesDec): FineFeatures;
export declare function findCoarseValidity({ gamma_2 }: VowelGroupPosition): CoarseValidity;
interface Position {
    f_3: boolean;
    f_2: boolean;
    f_1: boolean;
    f_0: boolean;
}
interface NormalWorld {
    features: FineFeatures;
    validity: CoarseValidity;
    xi: boolean;
}
interface ExtendedWorld {
    e: boolean;
}
type World = NormalWorld | ExtendedWorld;
export declare function evalV(t: boolean, world: World): Position;
export {};
//# sourceMappingURL=vowel.d.ts.map