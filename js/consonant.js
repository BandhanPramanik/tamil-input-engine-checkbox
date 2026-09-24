// input processsing
export function rewriteClusterPosition(clus) {
    let bin = Number(clus).toString(2).padStart(3, '0');
    // think of the digit placement as normal units place, tens place
    // then, because the most significant digit is at the 0th index,
    // reverse the count.
    return {
        c_2: bin[0] === "1",
        c_1: bin[1] === "1",
        c_0: bin[2] === "1"
    };
}
function findInvalidD({ c_i1, c_i0, c_s }, { s, i_1, i_0, m, v }) {
    // C_I, used for consonant validity has only three states: 00, 01, 10.
    const isCIShowing11 = c_i1 && c_i0;
    // Thou shalt not flip two switches.
    const isIdaiyinamAndMellinam = i_0 && m;
    const isIdaiyinamAndSibilant = i_0 && s;
    const isIdaiyinamAndVallinam = i_0 && v;
    const isMellinamAndSibilant = m && s;
    const isMellinamAndVallinam = m && v;
    const isSibilantAndVallinam = s && v;
    // I_1 only allowed when C_I1 = 1	
    const isI1Forbidden = i_1 && !c_i1;
    // I_0 only allowed when C_I = 01 or 10
    const isI0Forbidden = i_0 && !c_i0 && !c_i1;
    // Three states for Idaiyinam: 00 (for C_I = 00), 01, and 11. 
    // Note that C_I0 is always 1 when C_I is not 00. 
    // I_1 can't be flicked when I_0 = 0.
    const isI1BlockingI0 = i_1 && !i_0;
    // if C_S = 0 but S = 1, then error
    const isSibilantForbidden = s && !c_s;
    // No switches flicked. Simple as that.
    const areSwitchesFlicked = !i_0 && !m && !s && !v;
    return isCIShowing11 || isIdaiyinamAndMellinam || isIdaiyinamAndSibilant ||
        isIdaiyinamAndVallinam || isMellinamAndSibilant || isMellinamAndVallinam ||
        isSibilantAndVallinam || isI1Forbidden || isI0Forbidden ||
        isI1BlockingI0 || isSibilantForbidden || areSwitchesFlicked;
}
export function findCoarseValidity({ c_2, c_1, c_0 }) {
    const c_i1 = (c_2 !== c_1) && (c_1 !== c_0);
    const c_i0 = !c_1 && (c_2 !== c_0);
    const c_s = !c_2 && (c_0 || c_1);
    return { c_i1, c_i0, c_s };
}
function findFinePositions({ s, i_1, i_0, m, v }) {
    // Here, we are already assuming that the coarse stuff is valid and this whole thing is valid
    return {
        d_2: s,
        d_1: i_1,
        d_0: m || i_1
    };
}
function findExtended(e) {
    if (!e)
        return {
            d_2: !!1,
            d_1: !!0,
            d_0: !!1
        };
    else
        return {
            d_2: !!1,
            d_1: !!1,
            d_0: !!0
        };
}
export function evalD(alpha, world) {
    if (alpha && "e" in world) {
        const abc = findExtended(world.e);
        return {
            f_3: !!1,
            f_2: abc.d_2,
            f_1: abc.d_1,
            f_0: abc.d_0
        };
    }
    else if (!alpha && "features" in world) {
        const invalid_d = findInvalidD(world.validity, world.features);
        if (invalid_d)
            return {
                f_3: !!0,
                f_2: !!1,
                f_1: !!1,
                f_0: !!1
            };
        const abc = findFinePositions(world.features);
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
//# sourceMappingURL=consonant.js.map