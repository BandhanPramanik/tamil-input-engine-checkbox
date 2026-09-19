// input processing
export function rewriteVowelGroupPosition(vg) {
    let bin = Number(vg).toString(2).padStart(3, '0');
    // think of the digit placement as normal units place, tens place
    // then, because the most significant digit is at the 0th index,
    // reverse the count.
    return {
        gamma_2: bin[0] === "1",
        gamma_1: bin[1] === "1",
        gamma_0: bin[2] === "1"
    };
}
// input processing
export function rewriteFineFeatures(fd) {
    let bin = Number(fd).toString(2).padStart(2, '0');
    // think of the digit placement as normal units place, tens place
    // then, because the most significant digit is at the 0th index,
    // reverse the count.
    return {
        h: bin[0] === "1",
        m: bin[1] === "1"
    };
}
function findInvalidV({ v_h }, { h, m }) {
    // Either there's no diphthong for that vowel group(v_h = 0),
    // or the contrastive monophthong (m) switch is already flicked.
    const isDiphthongForbidden = h && (!v_h || m);
    return isDiphthongForbidden;
}
export function findCoarseValidity({ gamma_2 }) {
    const v_h = gamma_2;
    return { v_h };
}
function findFinePositions({ h, m }) {
    // Here, we are already assuming that the coarse stuff is valid and this whole thing is valid
    return {
        s_1: h,
        s_0: m
    };
}
function findExtended(e) {
    return {
        s_1: !!0,
        s_0: e
    };
}
export function evalV(t, world) {
    if (t && world.kind === "extended") {
        const abc = findExtended(world.e);
        return {
            f_3: !!1,
            f_2: !!0,
            f_1: abc.s_1,
            f_0: abc.s_0
        };
    }
    else if (!t && world.kind === "normal") {
        const invalid_v = findInvalidV(world.validity, world.features);
        if (invalid_v)
            return {
                f_3: !!0,
                f_2: !!1,
                f_1: !!1,
                f_0: !!1
            };
        const abc = findFinePositions(world.features);
        return {
            f_3: !!0,
            f_2: world.xi,
            f_1: abc.s_1,
            f_0: abc.s_0
        };
    }
    else {
        return {
            f_3: !!0,
            f_2: !!1,
            f_1: !!1,
            f_0: !!1
        };
    }
}
//# sourceMappingURL=vowel.js.map