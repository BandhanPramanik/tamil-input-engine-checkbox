# Human-generated code; looked at docs to make this
from sympy import symbols
from sympy.logic import *
from sympy.logic.boolalg import *

def find_minterms(output, minterms, length_output):
    output_bits = []
    for i in range(length_output):
        output_bits.append([])
        for j in output:
            output_bits[i].append((j&(2**i))>>i)

    minterms_d = []
    for i in range(length_output):
        minterms_d.append([])
        for j, ob1 in enumerate(output_bits[i]):
            if ob1 == 1:
                minterms_d[i].append(minterms[j])
    return minterms_d

# change this
ci1,ci0, cs, s,i1,i0,m,v = symbols('ci1,ci0,cs,s,i1,i0,m,v')
minterms = [1,2,4,12,16]
variables = [s,i1,i0,m,v]

dontcare_minterms = list(set(range(2**len(variables))) - set(minterms))
expr = SOPform(variables, minterms)
dontcare_expr = SOPform(variables, dontcare_minterms)

# change this
output = [i for i in range(len(minterms))]


length = len(minterms).bit_length()
minterms_d = find_minterms(output, minterms, length)
sop_d = []
for i in minterms_d:
    sop_d.append(SOPform(variables, i))
for i, final_expr in enumerate(sop_d):
    print("D" + str(i) + " =", simplify_logic(final_expr, dontcare=dontcare_expr))

# change these lines to include what's allowed
coarse = expr | ((ci1 ^ ci0) & i0) | (ci1 & ~ci0 & i0 & i1) # can be
coarse &= ~(ci1 & ci0) & ~(~cs & s) # cannot be


invalid_all = Not(coarse)
invalid_all = simplify_logic(invalid_all, force=True)
print("Invalid =", invalid_all)
