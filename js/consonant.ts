type Cluster = 0 | 1 | 2 | 3 | 4 | 5;

interface ClusterPosition {
	c_2: boolean,
	c_1: boolean,
	c_0: boolean
}

interface CoarseValidity {
    c_i1: boolean;
    c_i0: boolean;
    c_s: boolean;
}

interface FinePositions {
    d_2: boolean;
    d_1: boolean;
    d_0: boolean;
}

interface FineFeatures {
	s: boolean,
	i_1: boolean,
	i_0: boolean,
	m: boolean,
	v: boolean	
}

function rewriteClusterPosition(clus: Cluster): ClusterPosition
{
	let bin = clus.toString(2).padStart(3, '0');
	return {
		c_2: bin[0] === "1",
		c_1: bin[1] === "1",
		c_0: bin[2] === "1"
	};
} 

function findInvalidD({c_i1, c_i0, c_s}: CoarseValidity, {s, i_1, i_0, m, v}: FineFeatures, alpha: boolean): boolean
{
	// C_I, used for consonant validity has only three states: 00, 01, 10.
	const isCIShowing11 = c_i1 && c_i0;
	// Thou shalt not flip two switches.
	const isIdaiyinamAndMellinam = i_0 && m;
	const isIdaiyinamAndSibilant = i_0 && s;
	const isIdaiyinamAndVallinam = i_0 && v;
	const isMellinamAndSibilant = m && s;
	const isMellinamAndVallinam = m && v;
	const isSibilantAndVallinam = s && v;
	// Three states for Idaiyinam: 00 (for C_I = 00), 01, and 11. 
	// Note that C_I0 is always 1 when C_I is not 00. 
	// I_1 can't be flicked when I_0 = 0.
	const isI1BlockingI0= i_1 && !i_0;
	// if C_S = 0 but S = 1, then error
	const isSibilantForbidden = s && !c_s;
	// No switches flicked. Simple as that.
	const areSwitchesFlicked = !i_0 && !m && !s && !v;
	// Check if we are using the Extended Mode or the Normal mode
	const isExtended = alpha;
	return isCIShowing11 || isIdaiyinamAndMellinam || isIdaiyinamAndSibilant ||
	isIdaiyinamAndVallinam || isMellinamAndSibilant || isMellinamAndVallinam ||
	isSibilantAndVallinam || isI1BlockingI0 || isSibilantForbidden ||
	areSwitchesFlicked || isExtended;
}

function findCoarseValidity({c_2, c_1, c_0}: ClusterPosition): CoarseValidity
{
	const c_i1 = (c_2 !== c_1) && (c_1 !== c_0);
	const c_i0 = !c_1 && (c_2 !== c_0); 
	const c_s = !c_2 && (c_0 || c_1);	 
	return {c_i1, c_i0, c_s};
}


function findFinePositions({s, i_1, i_0, m, v}: FineFeatures): FinePositions
{
	// Here, we are already assuming that the coarse stuff is valid and this whole thing is valid
	return {
		d_2: s,
		d_1: i_1,
		d_0: m || i_1
	};
}

function findExtended(e:boolean): FinePositions
{
	if (!e)
		return {
			d_2: !!1,
			d_1: !!0,
			d_0: !!1
		}
	else
		return {
			d_2: !!1,
			d_1: !!1,
			d_0: !!0
		}
}

interface Position
{
	f_3: boolean,
	f_2: boolean,
	f_1: boolean,
	f_0: boolean
}

function evalD(invalid_d: boolean, alpha: boolean, features: FineFeatures, e: boolean): Position
{
	if (alpha)
	{
		const abc = findExtended(e)
		return {
			f_3: !!1,
			f_2: abc.d_2,
			f_1: abc.d_1,
			f_0: abc.d_0
		};
	}
	else if (!alpha && !invalid_d)
	{
		const abc = findFinePositions(features);
		return {
			f_3: !!1,
			f_2: abc.d_2,
			f_1: abc.d_1,
			f_0: abc.d_0
		};
	}
	else
		return {
			f_3: !!0,
			f_2: !!1,
			f_1: !!1,
			f_0: !!1
		};
}
/*
		const abc: FinePositions = {
			s: s,
			i_1: i_1,
			i_0: i_0,
			m: m,
			v: v
		};
*/