type Cluster = "0" | "1" | "2" | "3" | "4" | "5";
interface ClusterPosition {
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
export declare function rewriteClusterPosition(clus: Cluster): ClusterPosition;
export declare function findCoarseValidity({ c_2, c_1, c_0 }: ClusterPosition): CoarseValidity;
interface Position {
    f_3: boolean;
    f_2: boolean;
    f_1: boolean;
    f_0: boolean;
}
interface NormalWorld {
    kind: "normal";
    features: FineFeatures;
    validity: CoarseValidity;
}
interface ExtendedWorld {
    kind: "extended";
    e: boolean;
}
type World = NormalWorld | ExtendedWorld;
export declare function evalD(alpha: boolean, world: World): Position;
export {};
//# sourceMappingURL=consonant.d.ts.map