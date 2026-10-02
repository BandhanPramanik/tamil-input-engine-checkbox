type StrOrUndef = string | undefined;
type VowelGroup = "0" | "1" | "2" | "4" | "5";
type ConsonantGroup = "0" | "1" | "2" | "3" | "4" | "5";
interface VowelNormalInputType {
    grp: VowelGroup;
    pos: number;
}
interface ConsonantNormalInputType {
    grp: ConsonantGroup;
    pos: number;
}
interface ExtendedInputType {
    pos: number;
}
type VowelInputType = VowelNormalInputType | ExtendedInputType;
type ConsonantInputType = ConsonantNormalInputType | ExtendedInputType;
export declare function renderVowel(input: VowelInputType): StrOrUndef;
export declare function renderConsonant(input: ConsonantInputType): StrOrUndef;
export {};
//# sourceMappingURL=render.d.ts.map