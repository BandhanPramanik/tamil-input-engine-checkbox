type ConsonantGroup = "0" | "1" | "2" | "3" | "4" | "5";
interface CoarsePosition {
    c_2: boolean;
    c_1: boolean;
    c_0: boolean;
}
interface CoarseValidity {
    c_i1: boolean;
    c_i0: boolean;
    c_s: boolean;
}
interface FineFeatures {
    s: boolean;
    i_1: boolean;
    i_0: boolean;
    m: boolean;
    v: boolean;
}
export declare function rewriteCoarsePosition(clus: ConsonantGroup): CoarsePosition;
export declare function findCoarseValidity({ c_2, c_1, c_0 }: CoarsePosition): CoarseValidity;
interface NormalWorld {
    features: FineFeatures;
    validity: CoarseValidity;
}
interface ExtendedWorld {
    e1: boolean;
    e0: boolean;
}
type World = NormalWorld | ExtendedWorld;
export declare function evalD(alpha: boolean, world: World): number;
export {};
//# sourceMappingURL=consonant.d.ts.map