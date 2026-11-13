[Note: Used the Socratic method with Claude for this. After that, I asked it to write the algorithm for making the flowchart. After making the flowchart and building the website, I felt like making all the diagrams align closer to the actual implementation of the website, without losing the algorithm's "general" nature. The document below is the modified algorithm that happens to closely align with my website's flow.] 

### **Entry Point**
```
START
  ↓
[User selects mode: Consonant OR Vowel]
  ↓
[Reset both consonant AND vowel state]
  ↓
IDLE (Mode-specific)
  ├─ Consonant: Show cluster radios 
  └─ Vowel: Show vowel grouping radios
```

### **Main Loop**
```
IDLE
  ↓
[User selects/re-selects varga/group]
  ↓
ACCUMULATING-1: Varga/group state updated
  ↓
VALIDATING-1: findCoarseValidity()
  ↓
Decision: c_i1 = 1 AND c_i0 = 0? (CONSONANT ONLY!!!)
  ├─ YES → Run VALIDATING-3
  └─ NO → Don't run VALIDATING-3 and hide I_1
  ↓
VALIDATING-2: Show ALL fine features
VALIDATING-3: Conditional I_1 visibility (CONSONANT ONLY and if c_i1 = 1 AND c_i0 = 0 !!!)
  └─ Decision: Is i_0 clicked?
     ├─ YES → Show I_1 checkbox
     └─ NO → Hide I_1
  ↓
[User ticks fine feature]
  ↓
ACCUMULATING-2: Fine feature state updated
ACCUMULATING-3: Diacritic or Standalone vowel (VOWEL ONLY!!!)
  ↓
VALIDATING-4: evalD() / evalV() → output character
  ↓
[Check commit condition]
  ├─ Condition: Not "INVALID"
  ├─ NO → Print error message and go back to user ticking fine feature
  └─ YES → COMMIT
```

### **Commit & Reset**
```
COMMIT
  ↓
[Emit character to text buffer]
  ↓
[Wipe ALL state]
  ↓
[Fine features UI disappears]
  ↓
IDLE (Back to cluster radios only)
```

### **Special Cases (Branching)**

**Case 1: Alpha = 1 (Extended mode for the consonants only)**
```
[User selects Ja, Ha, or Ksha radio]
  ↓
VALIDATING-4: evalD() → output character
  ↓
[Bypass any validation entirely]
  ↓
COMMIT immediately
```
**Case 2: Special Modifiers, T = 1 (Extended mode for the vowels only)**
```
[User selects Pulli, Aytam or ZWNJ radio]
  ↓
VALIDATING-4: evalV() → output character
  ↓
[Bypass any validation or any diacritic stuff entirely]
  ↓
COMMIT immediately
```

**Case 3: Mode switching**
```
[User selects different mode]
  ↓
[Wipe ENTIRE state (consonant AND vowel)]
  ↓
IDLE
```
