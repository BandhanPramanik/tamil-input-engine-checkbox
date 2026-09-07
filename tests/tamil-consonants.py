from sympy import symbols
from sympy.logic import *
from sympy.logic.boolalg import *
ci1,ci0, cs, s,i1,i0,m,v = symbols('ci1,ci0,cs,s,i1,i0,m,v')
minterms = [1,2,4,12,16]
variables = [s,i1,i0,m,v]
expr = SOPform(variables, minterms)
coarse = expr | ((ci1 ^ ci0) & i0) | (ci1 & ~ci0 & i0 & i1) # can be
coarse &= ~(ci1 & ci0) & ~(~cs & s) # cannot be
invalid_all = Nand(expr, coarse)
dontcares = simplify_logic(invalid_all)
print("Invalid =", dontcares)
minterms_d2 = [{s: 1}]
minterms_d1 = [{i0: 1}]
minterms_d0 = [{m: 1},{i1:1, i0:1}]
sop_d2 = SOPform(variables, minterms_d2)
sop_d1 = SOPform(variables, minterms_d1)
sop_d0 = SOPform(variables, minterms_d0)
print("D2 =", simplify_logic(sop_d2, dontcare=dontcares))
print("D1 =", simplify_logic(sop_d1, dontcare=dontcares))
print("D0 =", simplify_logic(sop_d0, dontcare=dontcares))

