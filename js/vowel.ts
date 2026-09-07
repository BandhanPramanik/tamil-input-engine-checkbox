type VowelGroup = 0 | 1 | 2 | 4 | 5; // 3 has been omitted to make calculations easier

interface VowelGroupPosition {
	gamma_2: boolean,
	gamma_1: boolean,
	gamma_0: boolean
}

interface CoarseValidity {
    v_h: boolean;
}

interface FinePositions {
   	s_1: boolean;
    s_0: boolean;
}

interface FineFeatures {
	h: boolean;
	m: boolean;	
}

function rewriteVowelGroupPosition(vg: VowelGroup): VowelGroupPosition
{
	let bin = vg.toString(2).padStart(3, '0');
	return {
		gamma_2: bin[0] === "1",
		gamma_1: bin[1] === "1",
		gamma_0: bin[2] === "1"
	};
} 

function findInvalidV({v_h}: CoarseValidity, {h, m}: FineFeatures, t: boolean): boolean
{
	// Either there's no diphthong for that vowel group(v_h = 0),
	// or the contrastive monophthong (m) switch is already flicked.
	const isDiphthongForbidden = h && (!v_h || m);
	// Check if we are using the Extended Mode or the Normal mode
	const isExtended = t;
	return isDiphthongForbidden || isExtended;
}

function findCoarseValidity({gamma_2}: VowelGroupPosition): CoarseValidity
{
	const v_h = gamma_2;
	return {v_h};
}

function findFinePositions({h, m}: FineFeatures): FinePositions
{
	// Here, we are already assuming that the coarse stuff is valid and this whole thing is valid
	return {
		s_1: h,
		s_0: m
	};
}
function findExtended(e:boolean): FinePositions
{
	return {
		s_1: !!0,
		s_0: e
	};
}

interface Position
{
	f_3: boolean,
	f_2: boolean,
	f_1: boolean,
	f_0: boolean
}



function evalV(invalid_v: boolean, t: boolean, xi: boolean, features: FineFeatures, e: boolean): Position
{
	if (t)
	{
		const abc = findExtended(e);
		return {
			f_3: !!1,
			f_2: !!0,
			f_1: abc.s_1,
			f_0: abc.s_0
		};
	}
	else if (!t && !invalid_v)
	{
		const abc = findFinePositions(features);
		return {
			f_3: !!0,
			f_2: xi,
			f_1: abc.s_1,
			f_0: abc.s_0
		};
	}
	else
	{
		return {
			f_3: !!0,
			f_2: !!1,
			f_1: !!1,
			f_0: !!1
		};
	}
}