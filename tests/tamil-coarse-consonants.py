from sympy import symbols
from sympy.logic import *
from sympy.logic.boolalg import *

c2, c1, c0 = symbols('c2,c1,c0')
variables = [c2, c1, c0]

# change this [ci1, ci0, cs]. note that c_i accepts 00, 01, and 10 only. i accepts 00, 01, 11 only.
# each inner list corresponds with the respective rows in the lookup table
values = [[0, 0, 1, 0, 0, 1], [0, 1, 0, 0, 1, 0], [0, 1, 1, 0, 0, 1]]

'''
Explaining this part:

I=11 and I=01 don't have any specfic meaning 
embedded by the Boolean expression.

Their meanings are entirely set by the developer 
after looking at the letters present in those places.
'''
length = len(values[0]).bit_length()
output = [i for i in range(2**length)]

minterms = []
for i in range(length):
    # print()
    minterms.append([])
    for j, ob1 in enumerate(values[i]):
        # print(f"{j:03b} | {ob1}")
        if ob1 == 1:
            minterms[i].append(output[j])

sop = []
for i in minterms:
    sop.append(SOPform(variables, i))

print("C_I1 =", simplify_logic(sop[0], form="dnf"))
print("C_I0 =", simplify_logic(sop[1], form="dnf"))
print("C_S =", simplify_logic(sop[2], form="dnf"))

# This table is not designed with dontcares

