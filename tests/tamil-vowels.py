# Human-generated code; looked at docs to make this
from sympy import symbols
from sympy.logic import *
from sympy.logic.boolalg import *

def find_minterms(output, minterms, length_output):
    output_bits = []
    for i in range(length_output):
        output_bits.append([])
        for j in output:
            output_bits[i].append((j >> i) & 1)

    minterms_d = []
    for i in range(length_output):
        minterms_d.append([])
        for j, ob1 in enumerate(output_bits[i]):
            if ob1 == 1:
                minterms_d[i].append(minterms[j])
    return minterms_d


# change this
vi, h, m = symbols('vi, h, m')
variables = [h, m]
minterms = [0, 1, 2]

dontcare_minterms = list(set(range(2**len(variables))) - set(minterms))
expr = SOPform(variables, minterms)
dontcare_expr = SOPform(variables, dontcare_minterms)

# change this
output = [i for i in range(len(minterms))]

length = len(minterms).bit_length()
minterms_s = find_minterms(output, minterms, length)
sop_s = []
for i in minterms_s:
    sop_s.append(SOPform(variables, i))
for i, final_expr in enumerate(sop_s):
    print("S" + str(i) + " =", simplify_logic(final_expr, dontcare=dontcare_expr))

# change this
coarse = expr & ~(h & ~vi)

invalid_all = Not(coarse)
invalid_all = simplify_logic(invalid_all)
print("Invalid =", invalid_all)
