# Vibecoded, except the expressions
from dd import autoref

bdd = cudd.BDD()
bdd.declare('ci0', 'ci1', 'i0', 'i1', 's', 'cs', 'm', 'v')
abc = bdd.add_expr(r"(cs | ~s) & (i0 | ~i1) & (~ci0 | ~ci1) & (~i0 | ~m) & (~i0 | ~s) & (~i0 | ~v) & (~m | ~s) & (~m | ~v) & (~s | ~v) & (i0 | m | s | v)")
s = bdd.var('s')
i0 = bdd.var('i0')
i1 = bdd.var('i1')
m = bdd.var('m')
f1 = abc & s
f2 = abc & i0
f3 = abc & (i1 | m)

bdd.dump(
    'bdd.dot',
    roots=[f1, f2, f3],
    filetype='dot'
)
