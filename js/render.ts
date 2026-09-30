type StrOrUndef = string | undefined;
type FiveVowelGroups = [StrOrUndef, StrOrUndef, StrOrUndef, StrOrUndef, StrOrUndef];
type SixConsonantGroups = [StrOrUndef, StrOrUndef, StrOrUndef, StrOrUndef, StrOrUndef, StrOrUndef];
type VowelGroup = "0" | "1" | "2" | "4" | "5";
type ConsonantGroup = "0" | "1" | "2" | "3" | "4" | "5";

interface VowelNormalInputType
{
	grp: VowelGroup,
	pos: number
}
interface ConsonantNormalInputType
{
	grp: ConsonantGroup,
	pos: number
}
interface ExtendedInputType
{
	pos: number
}

type VowelInputType = VowelNormalInputType | ExtendedInputType;
type ConsonantInputType = ConsonantNormalInputType | ExtendedInputType;

const VOWEL_LOOKUP_TABLE: Array<FiveVowelGroups | string | undefined> = [
	/*0b0000*/ ["அ", "இ", "உ", "எ", "ஒ"],
	/*0b0001*/ ["ஆ", "ஈ", "ஊ", "ஏ", "ஓ"],
	/*0b0010*/ [undefined, undefined, undefined, "ஐ", "ஔ"],
	/*0b0011*/ undefined,
	/*0b0100*/ ["", "\u0BBF", "\u0BC1", "\u0BC6", "\u0BCA"],
	/*0b0101*/ ["\u0BBE", "\u0BC0", "\u0BC2", "\u0BC7", "\u0BCB"],
	/*0b0110*/ [undefined, undefined, undefined, "\u0BC8", "\u0BCC"],
	/*0b0111*/ "INVALID",
	/*0b1000*/ "\u0BCD",
	/*0b1001*/ "\u0B83",
	/*0b1010*/ "\u200C",
	/*0b1011*/ undefined,
	/*0b1100*/ undefined,
	/*0b1101*/ undefined,
	/*0b1110*/ undefined,
	/*0b1111*/ undefined,
];

// Alveolar moved to third coarse position.
// ஸ is alveolar, not dental.
// In the coarse validity truth table, I had to change the rows of
// C_I1 and C_I0, but not of C_S
const CONSONANT_LOOKUP_TABLE: Array<SixConsonantGroups | string | undefined> = [
	/*0b0000*/ ["க", "ச", "ட", "ற", "த", "ப"],
	/*0b0001*/ ["ங", "ஞ", "ண", "ன", "ந", "ம"],
	/*0b0010*/ [undefined, "ய", "ள", "ர", undefined, "வ"],
	/*0b0011*/ [undefined, undefined, "ழ", "ல", undefined, undefined],
	/*0b0100*/ [undefined, "ஶ", "ஷ", "ஸ", undefined, undefined],
	/*0b0101*/ undefined,
	/*0b0110*/ undefined,
	/*0b0111*/ "INVALID",
	/*0b1000*/ "ஜ",
	/*0b1001*/ "ஹ",
	/*0b1010*/ "க்ஷ",
	/*0b1011*/ undefined,
	/*0b1100*/ undefined,
	/*0b1101*/ undefined,
	/*0b1110*/ undefined,
	/*0b1111*/ undefined,
];

function renderVowel(input: VowelInputType): StrOrUndef
{
	let output;
	const entry = VOWEL_LOOKUP_TABLE[input.pos];

	if (entry !== undefined && ("grp" in input && typeof entry === "object"))
	{
		if (input.grp === "5") 
			output = entry[4];
		else if (input.grp === "4")
			output = entry[3];
		else
			output = entry[Number(input.grp)];
	}
	else if (typeof entry === "string" || typeof entry === "undefined")
		output = entry;
	return output;
}

function renderConsonant(input: ConsonantInputType): StrOrUndef
{
	let output;
	const entry = CONSONANT_LOOKUP_TABLE[input.pos];

	if (entry !== undefined && ("grp" in input && typeof entry === "object"))
		output = entry[Number(input.grp)];
	else if (typeof entry === "string" || typeof entry === "undefined")
		output = entry;
	return output;
}
