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
export declare function rewriteClusterPosition(clus: Cluster): ClusterPosition;
export declare function findCoarseValidity({ c_2, c_1, c_0 }: ClusterPosition): CoarseValidity;
export {};
//# sourceMappingURL=consonant.d.ts.map