from sympy import symbols
from sympy.logic import *
from sympy.logic.boolalg import *
vi, i, m = symbols('vi, i, m')
variables = [i, m]
minterms = [0, 1, 2]
expr = SOPform(variables, minterms)
coarse = expr & ~(i & ~vi)
invalid_all = Not(coarse)
dontcares = simplify_logic(invalid_all)
print("Invalid =", dontcares)
minterms_s1 = [{i:1}]
minterms_s0 = [{m:1}]
sop_s1 = SOPform(variables, minterms_s1)
sop_s0 = SOPform(variables, minterms_s0)
print("sssdfg1 =", simplify_logic(sop_s1, dontcare=dontcares))
print("sssdfg0 =", simplify_logic(sop_s0, dontcare=dontcares))
